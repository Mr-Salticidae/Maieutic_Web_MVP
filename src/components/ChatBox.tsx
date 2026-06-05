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
      setError(requestError instanceof Error ? requestError.message : "Maieutic 暂时没有回应成功。");
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
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 py-6 sm:px-6 lg:px-8">
      <header className="mb-5 flex flex-col gap-4 border-b border-line pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-moss">
            Maieutic Web MVP
          </p>
          <h1 className="text-3xl font-semibold text-ink sm:text-4xl">Maieutic</h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-bluegray">
            一个陪你把问题想清楚的 AI 共学者。
          </p>
        </div>
        <button
          type="button"
          onClick={clearHistory}
          className="h-10 rounded-[8px] border border-line bg-paper px-3 text-sm font-medium text-bluegray transition hover:border-bluegray hover:text-ink"
        >
          清空最近对话
        </button>
      </header>

      <section className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="flex min-h-[62vh] flex-col rounded-[8px] border border-line bg-paper/70 shadow-sm">
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-5">
            <MessageList messages={messages} loading={loading} />
            <div ref={scrollRef} />
          </div>

          {error ? (
            <div className="mx-4 mb-3 rounded-[8px] border border-clay/30 bg-clay/10 px-3 py-2 text-sm text-clay">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="border-t border-line bg-paper p-3 sm:p-4">
            <div className="flex gap-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    event.currentTarget.form?.requestSubmit();
                  }
                }}
                rows={2}
                placeholder="带一个真实问题来，比如：我想学剪辑但不知道从哪里开始。"
                className="min-h-[52px] flex-1 resize-none rounded-[8px] border border-line bg-white px-3 py-3 text-sm leading-6 text-ink outline-none transition placeholder:text-bluegray/65 focus:border-moss"
              />
              <button
                type="submit"
                disabled={!canSend}
                className="h-[52px] rounded-[8px] bg-ink px-5 text-sm font-semibold text-white transition hover:bg-bluegray disabled:cursor-not-allowed disabled:bg-line disabled:text-bluegray"
              >
                发送
              </button>
            </div>
          </form>
        </div>

        <aside className="rounded-[8px] border border-line bg-paper/80 p-4">
          <h2 className="text-sm font-semibold text-ink">最近历史</h2>
          <p className="mt-2 text-xs leading-5 text-bluegray">浏览器本地保存最近 20 条，不接数据库。</p>
          <div className="mt-4 grid gap-2">
            {messages
              .filter((message) => message.role === "user")
              .slice(-8)
              .reverse()
              .map((message) => (
                <button
                  key={message.id}
                  type="button"
                  onClick={() => setInput(message.content)}
                  className="rounded-[8px] border border-line bg-white px-3 py-2 text-left text-xs leading-5 text-bluegray transition hover:border-moss hover:text-ink"
                >
                  {message.content}
                </button>
              ))}
            {messages.filter((message) => message.role === "user").length === 0 ? (
              <div className="rounded-[8px] border border-dashed border-line px-3 py-4 text-xs leading-5 text-bluegray">
                还没有历史问题。
              </div>
            ) : null}
          </div>
        </aside>
      </section>
    </main>
  );
}
