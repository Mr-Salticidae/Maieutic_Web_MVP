import { MAIEUTIC_SYSTEM_PROMPT } from "./maieuticPrompt";
import { createMockResponse } from "./mockResponse";
import { parseModelResponse } from "./parseResponse";
import type { ChatMessage, ChatResponse, ProviderName } from "./types";

type ProviderConfig = {
  provider: ProviderName;
  model: string;
  apiKey?: string;
  baseUrl?: string;
};

function providerFromEnv(prefix: "AI" | "FALLBACK"): ProviderConfig | null {
  const provider = process.env[`${prefix}_PROVIDER`]?.toLowerCase() as ProviderName | undefined;
  const model = process.env[`${prefix}_MODEL`];
  const apiKey = process.env[`${prefix}_API_KEY`];
  const baseUrl = process.env[`${prefix}_BASE_URL`];

  if (!provider || !model) return null;
  if (provider !== "openai" && provider !== "anthropic") return null;

  return { provider, model, apiKey, baseUrl };
}

export async function generateMaieuticResponse(messages: ChatMessage[]): Promise<ChatResponse> {
  const forceMock = process.env.MAIEUTIC_MOCK === "1";
  const primary = providerFromEnv("AI");
  const fallback = providerFromEnv("FALLBACK");
  const configs = [primary, fallback].filter(Boolean) as ProviderConfig[];

  if (forceMock || configs.length === 0 || !configs.some((config) => config.apiKey)) {
    return createMockResponse(messages);
  }

  let lastError: unknown = null;

  for (const config of configs) {
    if (!config.apiKey) continue;
    try {
      return await callProvider(config, messages);
    } catch (error) {
      lastError = error;
    }
  }

  console.error("All model providers failed", lastError);
  return createMockResponse(messages);
}

async function callProvider(config: ProviderConfig, messages: ChatMessage[]) {
  if (config.provider === "anthropic") {
    return callAnthropic(config, messages);
  }
  return callOpenAICompatible(config, messages);
}

async function callOpenAICompatible(config: ProviderConfig, messages: ChatMessage[]) {
  const baseUrl = config.baseUrl || "https://api.openai.com/v1";
  const isClaudeModel = config.model.toLowerCase().includes("claude");
  
  const requestBody: Record<string, unknown> = {
    model: config.model,
    messages: [
      { role: "system", content: MAIEUTIC_SYSTEM_PROMPT },
      ...messages.map((message) => ({ role: message.role, content: message.content }))
    ]
  };
  
  if (!isClaudeModel) {
    requestBody.temperature = 0.2;
    requestBody.response_format = { type: "json_object" as const };
  }
  
  console.log("AI Request:", JSON.stringify({ model: config.model, baseUrl, isClaudeModel }, null, 2));
  
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("AI Response Error:", response.status, errorText);
    throw new Error(`OpenAI-compatible request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log("AI Response:", JSON.stringify(data, null, 2).slice(0, 2000));
  
  const content = data?.choices?.[0]?.message?.content;
  if (typeof content !== "string") throw new Error("OpenAI-compatible response missing content");
  return parseModelResponse(content);
}

async function callAnthropic(config: ProviderConfig, messages: ChatMessage[]) {
  const baseUrl = config.baseUrl || "https://api.anthropic.com/v1";
  const response = await fetch(`${baseUrl.replace(/\/$/, "")}/messages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.apiKey || "",
      "anthropic-version": "2023-06-01"
    },
    body: JSON.stringify({
      model: config.model,
      max_tokens: 1200,
      temperature: 0.2,
      system: MAIEUTIC_SYSTEM_PROMPT,
      messages: messages.map((message) => ({
        role: message.role,
        content: message.content
      }))
    })
  });

  if (!response.ok) {
    throw new Error(`Anthropic request failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data?.content?.find((item: { type?: string }) => item.type === "text")?.text;
  if (typeof content !== "string") throw new Error("Anthropic response missing content");
  return parseModelResponse(content);
}
