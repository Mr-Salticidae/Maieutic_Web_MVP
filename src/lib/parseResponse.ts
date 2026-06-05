import type { ChatResponse, MaieuticMode } from "./types";

const allowedModes = new Set<MaieuticMode>([
  "Knowledge",
  "Exploration",
  "Reflection",
  "Creation",
  "Research",
  "Unknown"
]);

function cleanFence(text: string) {
  return text
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function normalizeMode(value: unknown): MaieuticMode {
  if (typeof value !== "string") return "Unknown";
  const clean = value.replace(/\s*Mode$/i, "").trim();
  return allowedModes.has(clean as MaieuticMode) ? (clean as MaieuticMode) : "Unknown";
}

function nullableText(value: unknown) {
  if (typeof value !== "string") return null;
  const clean = value.trim();
  if (!clean || clean.toLowerCase() === "null") return null;
  return clean;
}

export function parseModelResponse(raw: string): ChatResponse {
  const text = cleanFence(raw);

  try {
    const parsed = JSON.parse(text) as Partial<ChatResponse>;
    return {
      mode: normalizeMode(parsed.mode),
      reply: typeof parsed.reply === "string" && parsed.reply.trim() ? parsed.reply.trim() : text,
      insight: nullableText(parsed.insight),
      beacon: nullableText(parsed.beacon)
    };
  } catch {
    return parseMarkdownFallback(text);
  }
}

function parseMarkdownFallback(text: string): ChatResponse {
  const insightMatch = text.match(/##\s*Insight\s*\n([\s\S]*?)(?=\n##\s*Beacon|\n##\s|$)/i);
  const beaconMatch = text.match(/##\s*Beacon\s*\n([\s\S]*?)(?=\n##\s|$)/i);
  const reply = text
    .replace(/##\s*Insight\s*\n[\s\S]*?(?=\n##\s*Beacon|\n##\s|$)/i, "")
    .replace(/##\s*Beacon\s*\n[\s\S]*?(?=\n##\s|$)/i, "")
    .trim();

  return {
    mode: "Unknown",
    reply: reply || text,
    insight: insightMatch ? insightMatch[1].trim() : null,
    beacon: beaconMatch ? beaconMatch[1].trim() : null
  };
}
