type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <div className="rounded-xl border border-clay-300/40 bg-clay-50/70 p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <svg
          className="h-3.5 w-3.5 text-clay-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-clay-700">
          Insight
        </span>
      </div>
      <p className="text-[13.5px] leading-relaxed text-ink-800">{insight}</p>
    </div>
  );
}
