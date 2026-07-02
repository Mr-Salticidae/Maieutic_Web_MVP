"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { MessageList, type UiMessage } from "./MessageList";
import type { ChatMessage, ChatResponse } from "@/lib/types";

const STORAGE_KEY = "maieutic-web-mvp.messages";
const MAX_HISTORY = 20;

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function toApiMessages(messages: UiMessage[]): ChatMessage[] {
  return messages.map((message) => ({
    role: message.role,
    content: message.role === "assistant" && message.result ? message.result.reply : message.content
  }));
}

export function ChatBox() {
  const [messages, setMessages] = useState<UiMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as UiMessage[];
      if (Array.isArray(parsed)) setMessages(parsed.slice(-MAX_HISTORY));
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_HISTORY)));
  }, [messages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, loading]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  }, [input]);

  const canSend = useMemo(() => input.trim().length > 0 && !loading, [input, loading]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSend) return;

    const userMessage: UiMessage = {
      id: makeId(),
      role: "user",
      content: input.trim()
    };

    const nextMessages = [...messages, userMessage].slice(-MAX_HISTORY);
    setMessages(nextMessages);
    setInput("");
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: toApiMessages(nextMessages) })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || "请求失败");
      }

      const result = (await response.json()) as ChatResponse;
      const assistantMessage: UiMessage = {
        id: makeId(),
        role: "assistant",
        content: result.reply,
        result
      };

      setMessages((current) => [...current, assistantMessage].slice(-MAX_HISTORY));
    } catch (requestError) {
      const errorMessage = requestError instanceof Error ? requestError.message : "";
      if (errorMessage.includes("配置") || errorMessage.includes("API") || errorMessage.includes("provider")) {
        setError("AI 模型暂时不可用。请检查 API 配置，或稍后再试。");
      } else {
        setError("Maieutic 暂时没有回应成功。请稍后再试，或换一种方式描述你的问题。");
      }
    } finally {
      setLoading(false);
    }
  }

  function clearHistory() {
    setMessages([]);
    setError(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <header className="mb-8 animate-fade-in">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-moss-700" />
              <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-500">
                Maieutic
              </span>
            </div>
            <h1 className="font-serif text-[2rem] leading-tight tracking-tight text-ink-900 sm:text-[2.5rem]">
              把问题想清楚。
            </h1>
            <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-ink-500">
              一个苏格拉底式的 AI 共学者。不替你做决定，不灌鸡汤，只帮你把模糊的念头理出形状。
            </p>
          </div>
          <button
            type="button"
            onClick={clearHistory}
            className="shrink-0 rounded-lg border border-line bg-paper-100/60 px-3.5 py-2 text-xs font-medium text-ink-500 transition-all duration-200 hover:border-line-strong hover:bg-paper-50 hover:text-ink-700"
          >
            清空对话
          </button>
        </div>
      </header>

      <section className="grid min-h-0 flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex min-h-[65vh] flex-col overflow-hidden rounded-2xl border border-line bg-paper-50/80 shadow-card backdrop-blur-sm">
          <div className="min-h-0 flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5">
            <MessageList messages={messages} loading={loading} />
            <div ref={scrollRef} />
          </div>

          {error ? (
            <div className="mx-4 mb-3 rounded-lg border border-clay-300/50 bg-clay-50/80 px-3.5 py-2.5 text-sm text-clay-700 sm:mx-6">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="border-t border-line bg-paper-100/50 p-3 sm:p-4">
            <div className="flex items-end gap-2.5">
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={1}
                placeholder="带一个真实问题来，比如：我想学剪辑但不知道从哪里开始。"
                className="min-h-[48px] max-h-44 flex-1 resize-none rounded-xl border border-line bg-white px-4 py-3 text-[14px] leading-relaxed text-ink-800 shadow-soft outline-none transition-all duration-200 placeholder:text-ink-400 focus:border-moss-500 focus:shadow-[0_0_0_3px_rgba(95,115,85,0.1)]"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-[48px] shrink-0 rounded-xl bg-ink-900 px-5 text-sm font-medium text-paper-50 shadow-soft transition-all duration-200 hover:bg-ink-800 hover:shadow-card active:translate-y-px disabled:cursor-not-allowed disabled:bg-ink-200 disabled:text-ink-400 disabled:shadow-none"
              >
                发送
              </button>
            </div>
            <p className="mt-2 px-1 text-[11px] text-ink-400">
              Enter 发送 · Shift + Enter 换行
            </p>
          </form>
        </div>

        <aside className="hidden animate-fade-in lg:block">
          <div className="sticky top-6 space-y-5">
            <div className="rounded-xl border border-line bg-paper-50/80 p-5 shadow-soft">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                最近对话
              </h2>
              <div className="mt-4 space-y-1.5">
                {messages
                  .filter((message) => message.role === "user")
                  .slice(-6)
                  .reverse()
                  .map((message) => (
                    <button
                      key={message.id}
                      type="button"
                      onClick={() => setInput(message.content)}
                      className="w-full truncate rounded-lg px-2.5 py-2 text-left text-[13px] leading-relaxed text-ink-600 transition-colors duration-150 hover:bg-paper-200 hover:text-ink-800"
                    >
                      {message.content}
                    </button>
                  ))}
                {messages.filter((message) => message.role === "user").length === 0 ? (
                  <p className="px-2.5 py-2 text-[12px] leading-relaxed text-ink-400">
                    还没有对话记录。
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-xl border border-line bg-paper-50/80 p-5 shadow-soft">
              <h2 className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-500">
                关于
              </h2>
              <p className="mt-3 text-[12px] leading-relaxed text-ink-500">
                对话保存在你的浏览器本地，不上传到服务器。
              </p>
            </div>
          </div>
        </aside>
      </section>
    </main>
  );
}
