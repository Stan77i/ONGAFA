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
export function ValueChain({
  current,
  className,
  variant = "light",
}: {
  current?: ValueChainStep;
  className?: string;
  /** `dark` : version des panneaux forêt (refonte), cercles numérotés et fil pointillé menthe. */
  variant?: "light" | "dark";
}) {
  if (variant === "dark") return <ValueChainDark className={className} />;
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

/**
 * Chaîne de valeur sur fond forêt : la dernière étape (l'autonomisation, le but) est orange.
 * Verticale jusqu'à 1280 px (les libellés restent entiers), horizontale au-delà.
 */
function ValueChainDark({ className }: { className?: string }) {
  return (
    <ol
      aria-label="Chaîne de valeur"
      className={cn("m-0 grid list-none gap-0 p-0 xl:grid-cols-7 xl:gap-y-7", className)}
    >
      {VALUE_CHAIN_STEPS.map((step, i) => {
        const last = i === VALUE_CHAIN_STEPS.length - 1;
        return (
          <li
            key={step.key}
            className="relative flex items-center gap-4 pb-4 xl:flex-col xl:items-start xl:gap-3.5 xl:pr-3 xl:pb-0"
          >
            {!last && (
              <span
                aria-hidden="true"
                className="absolute top-12 bottom-0 left-[23px] border-l-2 border-dashed border-mint/60 xl:top-[27px] xl:right-1 xl:bottom-auto xl:left-16 xl:border-t-2 xl:border-l-0"
              />
            )}
            <span
              className={cn(
                "relative grid size-12 flex-none place-items-center rounded-full border-2 text-[17px] font-extrabold xl:size-14 xl:text-[20px]",
                last ? "border-accent bg-accent text-ink" : "border-mint text-mint",
              )}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={cn("text-[17px] leading-[1.25] font-bold", last ? "text-mint" : "text-sand")}>
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
