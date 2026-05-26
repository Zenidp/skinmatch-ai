import axios from "axios";

// TrueFoundry AI Gateway — OpenAI-compatible endpoint
const GATEWAY_BASE_URL = process.env.TRUEFOUNDRY_GATEWAY_URL ?? "https://gateway.truefoundry.ai";

// Virtual model name configured in TrueFoundry dashboard
// (AI Gateway → Virtual Models → your model name)
const VIRTUAL_MODEL = process.env.TRUEFOUNDRY_MODEL_ID ?? "skinmatch-routine";

type Message = { role: "user" | "assistant" | "system"; content: string };

type GatewayResponse = {
  choices: Array<{ message: { content: string | null; reasoning?: string | null } }>;
};

export async function callGateway(messages: Message[], maxTokens = 3000): Promise<string> {
  const apiKey = process.env.TRUEFOUNDRY_API_KEY;
  if (!apiKey) throw new Error("TRUEFOUNDRY_API_KEY is not configured");

  const response = await axios.post<GatewayResponse>(
    `${GATEWAY_BASE_URL}/api/llm/v1/chat/completions`,
    {
      model: VIRTUAL_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature: 0.7,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      timeout: 60_000,
    }
  );

  const message = response.data.choices?.[0]?.message;
  if (message?.content) return message.content;

  // Reasoning models (Nemotron) may return content: null with answer in reasoning
  if (message?.reasoning) {
    const jsonMatch = message.reasoning.match(/\{[\s\S]*\}/);
    if (jsonMatch) return jsonMatch[0];
  }

  throw new Error("Empty response from TrueFoundry gateway");
}
