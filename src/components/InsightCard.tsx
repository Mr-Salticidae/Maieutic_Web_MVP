type InsightCardProps = {
  insight: string;
};

export function InsightCard({ insight }: InsightCardProps) {
  return (
    <section className="rounded-[8px] border border-clay/25 bg-clay/10 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-clay">
        Insight
      </div>
      <p className="text-sm leading-6 text-ink">{insight}</p>
    </section>
  );
}
