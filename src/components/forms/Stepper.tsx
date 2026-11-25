/** Progression d'un formulaire en étapes : « Étape 2 sur 4 — Vos cultures ». */
export function Stepper({ current, total, title }: { current: number; total: number; title: string }) {
  const pct = Math.round((current / total) * 100);
  return (
    <div className="space-y-2">
      <p className="flex items-baseline justify-between gap-3">
        <span className="font-display text-h3 font-semibold text-forest">{title}</span>
        <span className="shrink-0 text-meta font-semibold text-ink-soft">
          Étape {current} sur {total}
        </span>
      </p>
      <div
        className="h-2 overflow-hidden rounded-full bg-cream"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        aria-valuetext={`Étape ${current} sur ${total}`}
      >
        <div
          className="h-full rounded-full bg-afa transition-[width] duration-300"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
