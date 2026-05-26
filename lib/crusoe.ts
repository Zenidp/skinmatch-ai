import axios from "axios";

const CRUSOE_BASE_URL = "https://api.inference.crusoecloud.com/v1";

export const CRUSOE_MODELS = {
  // Hackathon model dari Emmanuel Acheampong (Crusoe DevRel)
  nemotron: "hack-crusoe/Nemotron-3-Nano-30B-A3B-FP8",
  // Fallback — pakai model name standar Crusoe
  llama3: "meta-llama/Llama-3.3-70B-Instruct",
  qwen: "Qwen/Qwen3-235B-A22B-Instruct-2507",
} as const;

type CrusoeMessage = { role: "user" | "assistant" | "system"; content: string };

type CrusoeMessage2 = {
  content: string | null;
  reasoning?: string | null;
};

type CrusoeResponse = {
  choices: Array<{ message: CrusoeMessage2; finish_reason: string }>;
};

export async function callCrusoe(
  model: string,
  messages: CrusoeMessage[],
  maxTokens = 3000
): Promise<string> {
  const apiKey = process.env.CRUSOE_API_KEY;
  if (!apiKey) throw new Error("CRUSOE_API_KEY is not configured");

  const response = await axios.post<CrusoeResponse>(
    `${CRUSOE_BASE_URL}/chat/completions`,
    {
      model,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 90_000,
    }
  );

  const choice = response.data.choices?.[0];
  if (!choice) throw new Error(`No choices in Crusoe response from model: ${model}`);

  // Reasoning models (Nemotron) put final answer in content, thinking in reasoning.
  // If content is null but reasoning has JSON, extract from reasoning as fallback.
  const content = choice.message.content;
  if (content) return content;

  const reasoning = choice.message.reasoning;
  if (reasoning) {
    const jsonMatch = reasoning.match(/\{[\s\S]*\}/);
    if (jsonMatch) return jsonMatch[0];
  }

  throw new Error(`Empty response from Crusoe model: ${model} (finish_reason: ${choice.finish_reason})`);
}
