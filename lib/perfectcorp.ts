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

// Actual shape returned by Perfect Corp API
type OutputItem = {
  type: string;
  ui_score?: number;
  raw_score?: number;
  mask_urls?: string[];
  skin_type?: string; // present when type === "skin_type"
  region?: string;    // "whole" | "t_zone" | "u_zone"
  score?: number;     // present for type === "all" | "skin_age"
  url: null;
};

type TaskData = {
  task_status: "running" | "success" | "error";
  error?: string;
  results: { output: OutputItem[] } | null;
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
      const code = data.error ?? "unknown";
      if (code.includes("error_src_face") || code.includes("face"))
        throw new Error("No face detected. Please use a clear, well-lit selfie facing the camera directly.");
      if (code.includes("below_min") || code.includes("below_mi"))
        throw new Error("Photo too small. Please use a higher resolution image (at least 480px).");
      throw new Error(`Skin analysis failed: ${code}`);
    }
  }

  throw new Error("Perfect Corp task timed out after 40 seconds");
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SKIN_TYPES = new Set<SkinType>(["oily", "dry", "combination", "normal", "sensitive"]);
function isSkinType(v: string): v is SkinType {
  return SKIN_TYPES.has(v as SkinType);
}

// ─── Parse output array from Perfect Corp ─────────────────────────────────────

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

const CONCERN_THRESHOLD = 30;

function parseOutput(output: OutputItem[]): {
  concerns: SkinConcern[];
  scores: Record<string, number>;
  skin_type: SkinType;
  skin_tone: string;
} {
  const scores: Record<string, number> = {};
  const concerns: SkinConcern[] = [];

  for (const item of output) {
    if (item.ui_score !== undefined && item.type in CONCERN_MAP) {
      scores[item.type] = item.ui_score;
      if (item.ui_score > CONCERN_THRESHOLD) {
        concerns.push(CONCERN_MAP[item.type]);
      }
    }
  }

  // Use skin_type from Perfect Corp directly (region: "whole")
  const skinTypeItem = output.find(i => i.type === "skin_type" && i.region === "whole");
  const apiSkinType = skinTypeItem?.skin_type?.toLowerCase() ?? "";
  const skin_type: SkinType = isSkinType(apiSkinType) ? apiSkinType : inferSkinTypeFromScores(scores);

  // Infer skin tone from dark_circle_v2 score
  const darkCircle = scores["dark_circle_v2"] ?? 0;
  let skin_tone = "Light-Medium";
  if (darkCircle > 70) skin_tone = "Deep";
  else if (darkCircle > 50) skin_tone = "Medium-Dark";
  else if (darkCircle > 30) skin_tone = "Medium";

  return { concerns, scores, skin_type, skin_tone };
}

// Fallback if Perfect Corp doesn't return skin_type
function inferSkinTypeFromScores(scores: Record<string, number>): SkinType {
  const oiliness = scores["oiliness"] ?? 0;
  const acne = scores["acne"] ?? 0;
  const redness = scores["redness"] ?? 0;

  if (acne > 45 || oiliness > 50) return "oily";
  if (redness > 45 && oiliness < 30) return "sensitive";
  if (oiliness > 28) return "combination";
  if (oiliness < 20 && acne < 20) return "normal";
  return "dry";
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

  const output = taskResult.results?.output ?? [];
  const { concerns, scores, skin_type, skin_tone } = parseOutput(output);

  return {
    skin_type,
    skin_tone,
    concerns,
    scores,
    source: "perfectcorp",
  };
}
