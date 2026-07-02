import type { ChatResponse, MaieuticMode } from "./types";

const allowedModes = new Set<MaieuticMode>([
  "Knowledge",
  "Exploration",
  "Reflection",
  "Creation",
  "Research",
  "Unknown"
]);

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

function unescapeJsonString(value: string): string {
  return value
    .replace(/\\n/g, "\n")
    .replace(/\\r/g, "\r")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"')
    .replace(/\\'/g, "'")
    .replace(/\\\\/g, "\\")
    .replace(/\\`/g, "`");
}

function extractFieldValue(jsonStr: string, field: string): string | null {
  const pattern = new RegExp(`"${field}":\\s*"([^"]*)"`, 'g');
  const match = pattern.exec(jsonStr);
  if (match) {
    return match[1];
  }

  const fallbackPattern = new RegExp(`"${field}":\\s*"`, 'g');
  const fallbackMatch = fallbackPattern.exec(jsonStr);
  if (!fallbackMatch) return null;

  const start = fallbackMatch.index + fallbackMatch[0].length;
  let i = start;
  let escape = false;

  while (i < jsonStr.length) {
    const ch = jsonStr[i];

    if (escape) {
      escape = false;
      i++;
      continue;
    }

    if (ch === "\\") {
      escape = true;
      i++;
      continue;
    }

    if (ch === '"') {
      const nextChar = jsonStr[i + 1];
      if (nextChar === ',' || nextChar === '}') {
        return jsonStr.slice(start, i);
      }
    }

    i++;
  }

  return jsonStr.slice(start);
}

function fixUnescapedQuotes(jsonStr: string): string {
  let result = '';
  let inString = false;
  let escape = false;
  
  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];
    
    if (escape) {
      result += ch;
      escape = false;
      continue;
    }
    
    if (ch === '\\') {
      result += ch;
      escape = true;
      continue;
    }
    
    if (ch === '"') {
      if (!inString) {
        inString = true;
        result += ch;
      } else {
        const nextChar = jsonStr[i + 1];
        if (nextChar === ',' || nextChar === '}' || nextChar === ':') {
          inString = false;
          result += ch;
        } else {
          result += '\\"';
        }
      }
      continue;
    }
    
    result += ch;
  }
  
  return result;
}

export function parseModelResponse(raw: string): ChatResponse {
  let text = raw
    .trim()
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();

  try {
    const parsed = JSON.parse(text) as Partial<ChatResponse>;
    const reply = typeof parsed.reply === "string" && parsed.reply.trim() ? parsed.reply.trim() : text;
    return {
      mode: normalizeMode(parsed.mode),
      reply: unescapeJsonString(reply),
      insight: nullableText(parsed.insight) ? unescapeJsonString(parsed.insight!) : null,
      beacon: nullableText(parsed.beacon) ? unescapeJsonString(parsed.beacon!) : null
    };
  } catch {
    // JSON parse failed, try fixing unescaped quotes
  }

  text = fixUnescapedQuotes(text);

  try {
    const parsed = JSON.parse(text) as Partial<ChatResponse>;
    const reply = typeof parsed.reply === "string" && parsed.reply.trim() ? parsed.reply.trim() : raw;
    return {
      mode: normalizeMode(parsed.mode),
      reply: unescapeJsonString(reply),
      insight: nullableText(parsed.insight) ? unescapeJsonString(parsed.insight!) : null,
      beacon: nullableText(parsed.beacon) ? unescapeJsonString(parsed.beacon!) : null
    };
  } catch {
    // JSON parse still failed, try regex fallback
  }

  const modeStr = extractFieldValue(text, "mode");
  const replyStr = extractFieldValue(text, "reply");
  const insightStr = extractFieldValue(text, "insight");
  const beaconStr = extractFieldValue(text, "beacon");

  if (modeStr && replyStr) {
    return {
      mode: normalizeMode(modeStr),
      reply: unescapeJsonString(replyStr),
      insight: nullableText(insightStr) ? unescapeJsonString(insightStr!) : null,
      beacon: nullableText(beaconStr) ? unescapeJsonString(beaconStr!) : null
    };
  }

  return parseMarkdownFallback(text);
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
