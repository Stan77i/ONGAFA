import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Chiffre clé VÉRIFIÉ. La date et la source sont obligatoires : un chiffre sans elles ne s'affiche pas.
 */
export function KeyFigure({
  value,
  label,
  asOf,
  source,
  onDark = false,
}: {
  value: string;
  label: string;
  asOf: string;
  source: string;
  onDark?: boolean;
}) {
  return (
    <div className={cn("border-l-4 pl-4", onDark ? "border-harvest" : "border-accent")}>
      <p
        className={cn(
          "font-display text-h1 font-semibold tabular-nums",
          onDark ? "text-white" : "text-forest",
        )}
      >
        {value}
      </p>
      <p className={cn("font-semibold", onDark ? "text-sand" : "text-ink")}>{label}</p>
      <p className={cn("mt-1 text-meta", onDark ? "text-leaf-light" : "text-ink-soft")}>
        Au {formatDate(asOf)} · Source : {source}
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
