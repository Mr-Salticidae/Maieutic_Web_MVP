export type ChatRole = "user" | "assistant";

export type ChatMessage = {
  role: ChatRole;
  content: string;
};

export type MaieuticMode =
  | "Knowledge"
  | "Exploration"
  | "Reflection"
  | "Creation"
  | "Research"
  | "Unknown";

export type ChatResponse = {
  reply: string;
  insight: string | null;
  beacon: string | null;
  mode: MaieuticMode;
};

export type ProviderName = "openai" | "anthropic" | "mock";
