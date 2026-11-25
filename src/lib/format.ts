const TZ = "Africa/Abidjan";

/** « 25 novembre 2026 » — toujours en heure d'Abidjan. */
export function formatDate(value: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: TZ,
  }).format(new Date(value));
}

/** « 25 nov. » pour les blocs compacts. */
export function formatShortDate(value: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: TZ }).format(
    new Date(value),
  );
}

/** Parties d'une date pour le bloc calendrier : { day: "25", month: "nov." }. */
export function dateParts(value: string | Date): { day: string; month: string; weekday: string } {
  const d = new Date(value);
  return {
    day: new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: TZ }).format(d),
    month: new Intl.DateTimeFormat("fr-FR", { month: "short", timeZone: TZ }).format(d),
    weekday: new Intl.DateTimeFormat("fr-FR", { weekday: "long", timeZone: TZ }).format(d),
  };
}

/** Montant en francs CFA : « 12 500 FCFA ». */
export function formatFcfa(amount: number): string {
  return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(amount)} FCFA`;
}

/** Initiales pour les avatars par défaut : « Aya Kouassi » → « AK ». */
export function initials(name: string): string {
  return (
    name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?"
  );
}
