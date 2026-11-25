import { cn } from "@/lib/cn";

export type AfaStatus = "active" | "in_progress" | "upcoming";

export const statusLabels: Record<AfaStatus, string> = {
  active: "AFA implantée",
  in_progress: "Déploiement en cours",
  upcoming: "AFA bientôt",
};

/**
 * Pastille de statut : forme + couleur + texte (jamais la couleur seule).
 * Implantée = disque plein ; en cours = disque à moitié ; bientôt = cercle en pointillés.
 */
export function StatusShape({ status, className }: { status: AfaStatus; className?: string }) {
  return (
    <svg viewBox="0 0 20 20" className={cn("size-4 shrink-0", className)} aria-hidden="true">
      {status === "active" && (
        <circle cx="10" cy="10" r="8" fill="#4a7230" stroke="#1d2417" strokeWidth="1.5" />
      )}
      {status === "in_progress" && (
        <>
          <circle cx="10" cy="10" r="8" fill="#ffffff" stroke="#1d2417" strokeWidth="1.5" />
          <path d="M10 2a8 8 0 0 1 0 16Z" fill="#e9b44c" />
          <circle cx="10" cy="10" r="8" fill="none" stroke="#1d2417" strokeWidth="1.5" />
        </>
      )}
      {status === "upcoming" && (
        <circle
          cx="10"
          cy="10"
          r="8"
          fill="#ffffff"
          stroke="#1d2417"
          strokeWidth="1.5"
          strokeDasharray="3 2.4"
        />
      )}
    </svg>
  );
}

export function StatusPill({ status, className }: { status: AfaStatus; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-white px-3 py-1 text-meta font-semibold text-ink ring-1 ring-rule",
        className,
      )}
    >
      <StatusShape status={status} />
      {statusLabels[status]}
    </span>
  );
}

export function MapLegend({ className }: { className?: string }) {
  return (
    <ul className={cn("flex flex-wrap gap-2", className)} aria-label="Légende de la carte">
      {(Object.keys(statusLabels) as AfaStatus[]).map((s) => (
        <li key={s}>
          <StatusPill status={s} />
        </li>
      ))}
    </ul>
  );
}
