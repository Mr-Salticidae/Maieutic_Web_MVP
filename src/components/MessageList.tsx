import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { BeaconCard } from "./BeaconCard";
import { InsightCard } from "./InsightCard";
import type { ChatResponse } from "@/lib/types";
import { useState } from "react";

export type UiMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  result?: ChatResponse;
};

type MessageListProps = {
  messages: UiMessage[];
  loading: boolean;
};

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard not available
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="rounded-md px-2 py-1 text-[11px] font-medium text-ink-400 transition-colors hover:bg-paper-200 hover:text-ink-600"
      title="复制回复"
    >
      {copied ? "已复制" : "复制"}
    </button>
  );
}

export function MessageList({ messages, loading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="mx-auto max-w-md animate-fade-in py-12 text-center">
        <div className="mb-6 flex justify-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white shadow-soft">
            <svg
              className="h-5 w-5 text-moss-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>
        </div>
        <h2 className="font-serif text-xl tracking-tight text-ink-800">
          带一个真实问题来：
        </h2>
        <ul className="mt-4 space-y-2 text-left">
          {[
            "RAG 是什么？为什么最近都在说？",
            "我想学剪辑，但不知道从哪里开始",
            "我最近什么都想学，但什么都开始不了",
            "我想做一个 AI 公益项目，帮助乡村孩子"
          ].map((item, index) => (
            <li
              key={index}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[14px] text-ink-500 transition-colors hover:bg-paper-200/50 cursor-pointer"
            >
              <span className="font-mono text-[11px] text-ink-400">0{index + 1}</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {messages.map((message, index) => (
        <div
          key={message.id}
          className={`animate-slide-up ${message.role === "user" ? "flex justify-end" : "flex justify-start"}`}
          style={{ animationDelay: `${index * 30}ms` }}
        >
          <article
            className={
              message.role === "user"
                ? "max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-md bg-ink-900 px-4 py-3 text-[14px] leading-relaxed text-paper-50 shadow-soft"
                : "max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-md border border-line bg-white px-4 py-4 text-[14px] leading-relaxed text-ink-800 shadow-soft"
            }
          >
            {message.role === "assistant" && message.result?.mode ? (
              <div className="mb-3 inline-flex items-center gap-1.5 rounded-md bg-moss-50 px-2 py-1">
                <span className="h-1.5 w-1.5 rounded-full bg-moss-500" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-moss-700">
                  {message.result.mode}
                </span>
              </div>
            ) : null}
            {message.role === "assistant" ? (
              <div className="markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{message.content}</div>
            )}
            {message.result?.insight ? (
              <div className="mt-4">
                <InsightCard insight={message.result.insight} />
              </div>
            ) : null}
            {message.result?.beacon ? (
              <div className="mt-3">
                <BeaconCard beacon={message.result.beacon} />
              </div>
            ) : null}
            {message.role === "assistant" ? (
              <div className="mt-3 flex justify-end">
                <CopyButton text={message.content} />
              </div>
            ) : null}
          </article>
        </div>
      ))}
      {loading ? (
        <div className="flex justify-start animate-fade-in">
          <div className="max-w-[95%] sm:max-w-[90%] rounded-2xl rounded-tl-md border border-line bg-white px-4 py-4 shadow-soft">
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-ink-300" style={{ animationDelay: "0ms" }} />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-ink-300" style={{ animationDelay: "150ms" }} />
                <span className="h-2 w-2 animate-pulse-soft rounded-full bg-ink-300" style={{ animationDelay: "300ms" }} />
              </div>
              <span className="text-[13px] text-ink-400">Maieutic 正在思考…</span>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
