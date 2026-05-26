import axios from "axios";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SkinConcern =
  | "acne"
  | "dark_spots"
  | "wrinkles"
  | "pores"
  | "texture"
  | "redness"
  | "dark_circles"
  | "oiliness";

export type SkinType = "oily" | "dry" | "combination" | "normal" | "sensitive";

export type SkinAnalysisResult = {
  skin_type: SkinType;
  skin_tone: string;
  concerns: SkinConcern[];
  scores: Record<string, number>;
  source: "perfectcorp";
};

// Concerns to request from Perfect Corp (SD actions — valid for images with short side >= 480px)
const DST_ACTIONS = [
  "acne",
  "wrinkle",
  "pore",
  "texture",
  "dark_circle_v2",
  "redness",
  "oiliness",
  "age_spot",
  "skin_type",
] as const;

const BASE_URL = "https://yce-api-01.makeupar.com";
const POLL_INTERVAL_MS = 2000;
const POLL_MAX_ATTEMPTS = 20; // 40 seconds max

// ─── Step 1: Register file metadata, get presigned S3 URL ────────────────────

type FileRegisterResponse = {
  status: number;
  data: {
    files: Array<{
      file_id: string;
      requests: Array<{
        method: string;
        url: string;
        headers: Record<string, string>;
      }>;
    }>;
  };
};

type ParsedFileInfo = {
  file_id: string;
  upload_url: string;
  upload_headers: Record<string, string>;
};

async function registerFile(
  apiKey: string,
  fileName: string,
  fileSize: number,
  contentType: string
): Promise<ParsedFileInfo> {
  const res = await axios.post<FileRegisterResponse>(
    `${BASE_URL}/s2s/v2.0/file/skin-analysis`,
    {
      files: [{ content_type: contentType, file_name: fileName, file_size: fileSize }],
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 15_000,
    }
  );

  const file = res.data?.data?.files?.[0];
  if (!file?.file_id || !file?.requests?.[0]?.url) {
    throw new Error("No presigned URL returned from Perfect Corp");
  }

  return {
    file_id: file.file_id,
    upload_url: file.requests[0].url,
    upload_headers: file.requests[0].headers ?? {},
  };
}

// ─── Step 2: Upload image to presigned S3 URL ─────────────────────────────────

async function uploadToS3(
  presignedUrl: string,
  headers: Record<string, string>,
  imageBuffer: Buffer,
  contentType: string
): Promise<void> {
  await axios.put(presignedUrl, imageBuffer, {
    headers: { ...headers, "Content-Type": contentType },
    timeout: 30_000,
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
  });
}

// ─── Step 3: Create skin analysis task ────────────────────────────────────────

type TaskCreateResponse = {
  status: number;
  data: { task_id: string };
};

async function createTask(apiKey: string, fileId: string): Promise<string> {
  const res = await axios.post<TaskCreateResponse>(
    `${BASE_URL}/s2s/v2.0/task/skin-analysis`,
    {
      src_file_id: fileId,
      dst_actions: [...DST_ACTIONS],
      format: "json",
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 15_000,
    }
  );

  const taskId = res.data?.data?.task_id;
  if (!taskId) throw new Error("No task_id returned from Perfect Corp");
  return taskId;
}

// ─── Step 4: Poll until task complete ─────────────────────────────────────────

type TaskData = {
  task_status: "running" | "success" | "error";
  error?: string;
  results: Record<
    string,
    { ui_score: number; raw_score: number; mask_urls?: string[] }
  > | null;
};

type TaskPollResponse = {
  status: number;
  data: TaskData;
};

async function pollTask(apiKey: string, taskId: string): Promise<TaskData> {
  for (let attempt = 0; attempt < POLL_MAX_ATTEMPTS; attempt++) {
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));

    const res = await axios.get<TaskPollResponse>(
      `${BASE_URL}/s2s/v2.0/task/skin-analysis/${taskId}`,
      {
        headers: { Authorization: `Bearer ${apiKey}` },
        timeout: 15_000,
      }
    );

    const data = res.data?.data;
    if (!data) throw new Error("Invalid poll response from Perfect Corp");
    if (data.task_status === "success") return data;
    if (data.task_status === "error") {
      throw new Error(`Perfect Corp task failed: ${data.error ?? "unknown error"}`);
    }
  }

  throw new Error("Perfect Corp task timed out after 40 seconds");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKIN_TYPES = new Set<SkinType>(["oily", "dry", "combination", "normal", "sensitive"]);
function isSkinType(v: string): v is SkinType {
  return SKIN_TYPES.has(v as SkinType);
}

// ─── Score → SkinType inference ───────────────────────────────────────────────

function inferSkinType(scores: Record<string, number>): SkinType {
  const oiliness = scores["oiliness"] ?? 0;
  const acne = scores["acne"] ?? 0;
  const texture = scores["texture"] ?? 0;
  const redness = scores["redness"] ?? 0;

  // Acne-prone or very oily
  if (acne > 45 || oiliness > 50) return "oily";
  // Sensitive: noticeable redness, low oiliness
  if (redness > 45 && oiliness < 30) return "sensitive";
  // Combination: moderate oiliness (T-zone pattern)
  if (oiliness > 28 && oiliness <= 50) return "combination";
  // Clearly normal: all concerns low
  if (oiliness < 20 && acne < 20 && texture < 20) return "normal";

  return "dry";
}

function inferSkinTone(scores: Record<string, number>): string {
  const darkCircle = scores["dark_circle"] ?? 0;
  if (darkCircle > 60) return "Deep";
  if (darkCircle > 40) return "Medium-Dark";
  if (darkCircle > 20) return "Medium";
  return "Light-Medium";
}

function parseConcerns(results: TaskData["results"] | undefined): {
  concerns: SkinConcern[];
  scores: Record<string, number>;
} {
  const scores: Record<string, number> = {};
  const concerns: SkinConcern[] = [];

  if (!results) return { concerns, scores };

  const CONCERN_MAP: Record<string, SkinConcern> = {
    acne: "acne",
    wrinkle: "wrinkles",
    pore: "pores",
    texture: "texture",
    dark_circle_v2: "dark_circles",
    redness: "redness",
    age_spot: "dark_spots",
    oiliness: "oiliness",
  };

  const CONCERN_THRESHOLD = 30; // ui_score above this = concern detected

  for (const [action, data] of Object.entries(results)) {
    const uiScore = data.ui_score ?? 0;
    scores[action] = uiScore;
    const mapped = CONCERN_MAP[action];
    if (mapped && uiScore > CONCERN_THRESHOLD) {
      concerns.push(mapped);
    }
  }

  return { concerns, scores };
}

// ─── Main export ──────────────────────────────────────────────────────────────

export async function analyzeSkin(imageFile: File): Promise<SkinAnalysisResult> {
  const apiKey = process.env.PERFECTCORP_API_KEY;
  if (!apiKey) throw new Error("PERFECTCORP_API_KEY is not configured");

  const arrayBuffer = await imageFile.arrayBuffer();
  const imageBuffer = Buffer.from(arrayBuffer);
  const contentType = imageFile.type || "image/jpeg";
  const fileName = imageFile.name || "face.jpg";

  // Step 1: Register file
  const { file_id, upload_url, upload_headers } = await registerFile(
    apiKey,
    fileName,
    imageBuffer.byteLength,
    contentType
  );

  // Step 2: Upload to S3
  await uploadToS3(upload_url, upload_headers, imageBuffer, contentType);

  // Step 3: Create task
  const taskId = await createTask(apiKey, file_id);

  // Step 4: Poll for result
  const taskResult = await pollTask(apiKey, taskId);

  // Parse into our format
  const { concerns, scores } = parseConcerns(taskResult.results);

  // Perfect Corp may return skin_type directly as a score key with a label
  const apiSkinType = taskResult.results?.["skin_type"];
  const skinType: SkinType =
    apiSkinType && isSkinType(String(apiSkinType.ui_score))
      ? (String(apiSkinType.ui_score) as SkinType)
      : inferSkinType(scores);

  return {
    skin_type: skinType,
    skin_tone: inferSkinTone(scores),
    concerns,
    scores,
    source: "perfectcorp",
  };
}
