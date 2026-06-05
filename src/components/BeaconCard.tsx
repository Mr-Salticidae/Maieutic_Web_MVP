type BeaconCardProps = {
  beacon: string;
};

export function BeaconCard({ beacon }: BeaconCardProps) {
  return (
    <section className="rounded-[8px] border border-moss/30 bg-moss/10 p-4">
      <div className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-moss">
        Beacon
      </div>
      <p className="text-sm leading-6 text-ink">{beacon}</p>
    </section>
  );
}
