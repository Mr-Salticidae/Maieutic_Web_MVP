import { NextResponse } from "next/server";
import { generateMaieuticResponse } from "@/lib/aiClient";
import type { ChatMessage } from "@/lib/types";

export const runtime = "nodejs";

function isValidMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = Array.isArray(body?.messages) ? body.messages.filter(isValidMessage) : [];

    if (messages.length === 0) {
      return NextResponse.json({ error: "messages 不能为空" }, { status: 400 });
    }

    const response = await generateMaieuticResponse(messages.slice(-12));
    return NextResponse.json(response);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error: "Maieutic 暂时没有回应成功。请稍后重试，或检查模型配置。"
      },
      { status: 500 }
    );
  }
}
