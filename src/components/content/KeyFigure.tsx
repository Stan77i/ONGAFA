import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Chiffre clé. La source est obligatoire, ainsi qu'une date (`asOf`) OU une période (`period`,
 * pour un bilan déclaré sans date précise, ex. « Bilan déclaré depuis 2016 »).
 */
export function KeyFigure({
  value,
  label,
  source,
  onDark = false,
  ...when
}: {
  value: string;
  label: string;
  source: string;
  onDark?: boolean;
} & ({ asOf: string; period?: never } | { period: string; asOf?: never })) {
  const context = when.asOf ? `Au ${formatDate(when.asOf)}` : when.period;
  return (
    <div className={cn("border-l-4 pl-4", onDark ? "border-harvest" : "border-accent")}>
      <p
        className={cn(
          "font-display font-semibold tabular-nums",
          // Valeur en toutes lettres (« Une demi-dizaine ») : taille réduite pour ne pas couper les mots.
          value.length > 9 ? "text-h2" : "text-h1",
          onDark ? "text-white" : "text-forest",
        )}
      >
        {value}
      </p>
      <p className={cn("font-semibold", onDark ? "text-sand" : "text-ink")}>{label}</p>
      <p className={cn("mt-1 text-meta", onDark ? "text-leaf-light" : "text-ink-soft")}>
        {context} · Source : {source}
      </p>
    </div>
  );
}

/** Mention de fraîcheur et de source pour tout contenu ou donnée. */
export function DataStamp({
  updatedAt,
  source,
  className,
}: {
  updatedAt: string;
  source?: string;
  className?: string;
}) {
  return (
    <p className={cn("text-meta text-ink-soft", className)}>
      Mis à jour le <time dateTime={updatedAt}>{formatDate(updatedAt)}</time>
      {source && <> · Source : {source}</>}
    </p>
  );
}
