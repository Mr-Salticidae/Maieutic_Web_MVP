import { BeaconCard } from "./BeaconCard";
import { InsightCard } from "./InsightCard";
import type { ChatResponse } from "@/lib/types";

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

export function MessageList({ messages, loading }: MessageListProps) {
  if (messages.length === 0) {
    return (
      <div className="grid gap-3 rounded-[8px] border border-dashed border-line bg-paper/70 p-5 text-sm leading-6 text-bluegray">
        <p>你可以带来一个真实问题。</p>
        <ul className="grid gap-2">
          <li>一个明确知识点</li>
          <li>一个学习方向</li>
          <li>一个卡住的念头</li>
          <li>一个创作、产品或职业选择</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <article
          key={message.id}
          className={
            message.role === "user"
              ? "ml-auto max-w-[86%] rounded-[8px] bg-ink px-4 py-3 text-sm leading-6 text-white"
              : "max-w-[92%] rounded-[8px] border border-line bg-paper px-4 py-4 text-sm leading-6 text-ink shadow-sm"
          }
        >
          {message.role === "assistant" && message.result?.mode ? (
            <div className="mb-3 inline-flex rounded-[6px] border border-line bg-mist px-2 py-1 text-xs font-medium text-bluegray">
              {message.result.mode} Mode
            </div>
          ) : null}
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.result?.insight ? (
            <div className="mt-4">
              <InsightCard insight={message.result.insight} />
            </div>
          ) : null}
          {message.result?.beacon ? (
            <div className="mt-4">
              <BeaconCard beacon={message.result.beacon} />
            </div>
          ) : null}
        </article>
      ))}
      {loading ? (
        <div className="max-w-[92%] rounded-[8px] border border-line bg-paper px-4 py-4 text-sm text-bluegray">
          Maieutic 正在整理回应...
        </div>
      ) : null}
    </div>
  );
}
