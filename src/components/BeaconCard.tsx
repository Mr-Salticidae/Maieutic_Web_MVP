type BeaconCardProps = {
  beacon: string;
};

export function BeaconCard({ beacon }: BeaconCardProps) {
  return (
    <div className="rounded-xl border border-moss-300/50 bg-moss-50/80 p-4">
      <div className="mb-2 flex items-center gap-1.5">
        <svg
          className="h-3.5 w-3.5 text-moss-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z"
          />
        </svg>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-moss-700">
          Beacon
        </span>
      </div>
      <p className="text-[13.5px] leading-relaxed text-ink-800">{beacon}</p>
    </div>
  );
}
