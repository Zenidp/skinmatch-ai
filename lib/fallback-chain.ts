import { callGateway } from "./llm-gateway";
import { callCrusoe, CRUSOE_MODELS } from "./crusoe";
import { getStaticRoutine } from "./static-routines";
import type { SkinAnalysisResult } from "./perfectcorp";

type RoutineStep = {
  name: string;
  description: string;
  tip?: string;
};

type Product = {
  name: string;
  brand: string;
  category: string;
  price_range: "$" | "$$" | "$$$";
  why: string;
};

export type RoutineResult = {
  morning: RoutineStep[];
  night: RoutineStep[];
  products: Product[];
  llm_source: "truefoundry" | "nemotron" | "llama3" | "qwen" | "static";
};

// ─── Prompt ───────────────────────────────────────────────────────────────────

function buildMessages(skinData: SkinAnalysisResult) {
  return [
    {
      role: "system" as const,
      content:
        "You are a skincare expert. Always respond with valid JSON only. No markdown, no code blocks, no explanation — just the raw JSON object.",
    },
    {
      role: "user" as const,
      content: `You are a professional skincare advisor specializing in tropical and diverse skin types.

Skin profile:
- Type: ${skinData.skin_type}
- Tone: ${skinData.skin_tone}
- Concerns: ${skinData.concerns.join(", ") || "none"}

Generate a JSON skincare routine. Return ONLY valid JSON:
{
  "morning": [{ "name": "step name", "description": "short description", "tip": "optional tip" }],
  "night": [{ "name": "step name", "description": "short description", "tip": "optional tip" }],
  "products": [{ "name": "product name", "brand": "brand", "category": "cleanser|toner|serum|moisturizer|sunscreen|treatment", "price_range": "$|$$|$$$", "why": "one sentence reason" }]
}

Include 3-5 steps per routine and 4-6 product recommendations. Prioritize globally accessible brands (CeraVe, The Ordinary, Cosrx, Innisfree, La Roche-Posay, Neutrogena). Focus on tropical climate needs for oily/combination skin types.`,
    },
  ];
}

// ─── JSON parser (robust — handles LLM quirks) ────────────────────────────────

function parseRoutineJson(raw: string, source: RoutineResult["llm_source"]): RoutineResult {
  // Strip markdown code fences if LLM adds them despite instructions
  const cleaned = raw
    .replace(/```json\s*/gi, "")
    .replace(/```\s*/gi, "")
    .trim();

  const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error(`No JSON object found in LLM response from ${source}`);

  const parsed = JSON.parse(jsonMatch[0]);

  if (!Array.isArray(parsed.morning) || !Array.isArray(parsed.night)) {
    throw new Error(`Invalid routine structure from ${source}`);
  }

  return {
    morning: parsed.morning,
    night: parsed.night,
    products: Array.isArray(parsed.products) ? parsed.products : [],
    llm_source: source,
  };
}

// ─── Fallback chain ───────────────────────────────────────────────────────────
//
// Level 1: TrueFoundry AI Gateway
//          (internally routes: Nemotron → Llama-3.3 → Qwen via priority fallback)
// Level 2: Nemotron directly on Crusoe (bypass TrueFoundry)
// Level 3: Llama-3.3 directly on Crusoe
// Level 4: Qwen directly on Crusoe
// Level 5: Static JSON rules engine (zero dependency, always works)

export async function generateRoutine(skinData: SkinAnalysisResult): Promise<RoutineResult> {
  const messages = buildMessages(skinData);

  // Level 1: TrueFoundry AI Gateway
  try {
    const raw = await callGateway(messages);
    return parseRoutineJson(raw, "truefoundry");
  } catch (e) {
    console.warn("[fallback-chain] L1 TrueFoundry failed:", (e as Error).message);
  }

  // Level 2: Nemotron direct on Crusoe
  try {
    const raw = await callCrusoe(CRUSOE_MODELS.nemotron, messages);
    return parseRoutineJson(raw, "nemotron");
  } catch (e) {
    console.warn("[fallback-chain] L2 Nemotron/Crusoe failed:", (e as Error).message);
  }

  // Level 3: Llama-3.3 direct on Crusoe
  try {
    const raw = await callCrusoe(CRUSOE_MODELS.llama3, messages);
    return parseRoutineJson(raw, "llama3");
  } catch (e) {
    console.warn("[fallback-chain] L3 Llama3/Crusoe failed:", (e as Error).message);
  }

  // Level 4: Qwen direct on Crusoe
  try {
    const raw = await callCrusoe(CRUSOE_MODELS.qwen, messages);
    return parseRoutineJson(raw, "qwen");
  } catch (e) {
    console.warn("[fallback-chain] L4 Qwen/Crusoe failed:", (e as Error).message);
  }

  // Level 5: Static rules engine
  console.warn("[fallback-chain] L5 All LLMs failed — using static fallback");
  return getStaticRoutine(skinData.skin_type);
}
