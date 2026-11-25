import { cn } from "@/lib/cn";

/** Les étapes de la filière, dans l'ordre défini par l'ONG AFA. */
export const VALUE_CHAIN_STEPS = [
  { key: "production", label: "Production" },
  { key: "collecte", label: "Collecte" },
  { key: "transformation", label: "Transformation" },
  { key: "valorisation", label: "Valorisation" },
  { key: "commercialisation", label: "Commercialisation" },
  { key: "debouches", label: "Débouchés" },
  { key: "autonomisation", label: "Autonomisation des producteurs" },
] as const;

export type ValueChainStep = (typeof VALUE_CHAIN_STEPS)[number]["key"];

/**
 * Ruban de la chaîne de valeur : fil visuel récurrent de l'identité AFA.
 * Vertical sur mobile (lisible), horizontal à partir de la tablette.
 */
export function ValueChain({ current, className }: { current?: ValueChainStep; className?: string }) {
  return (
    <ol
      className={cn("grid gap-0 md:grid-flow-col md:auto-cols-fr", className)}
      aria-label="Chaîne de valeur"
    >
      {VALUE_CHAIN_STEPS.map((step, i) => {
        const active = step.key === current;
        const last = i === VALUE_CHAIN_STEPS.length - 1;
        return (
          <li
            key={step.key}
            aria-current={active ? "step" : undefined}
            className="relative flex items-center gap-3 py-2 md:flex-col md:items-start md:py-0 md:pr-3"
          >
            {/* Liaison entre les étapes */}
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-10 bottom-0 left-[1.1rem] w-0.5 bg-leaf/40 md:top-[1.1rem] md:right-0 md:bottom-auto md:left-10 md:h-0.5 md:w-auto"
              />
            )}
            <span
              className={cn(
                "relative z-10 grid size-9 shrink-0 place-items-center rounded-full border-2 font-display text-base font-semibold",
                active ? "border-forest bg-accent text-ink" : "border-afa bg-white text-afa",
              )}
            >
              {i + 1}
            </span>
            <span
              className={cn(
                "text-base font-semibold md:mt-2 md:text-meta",
                active ? "text-ink" : "text-forest",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
