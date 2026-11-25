import { CalendarDays, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { StatusPill, type AfaStatus } from "./StatusPill";
import { formatDate } from "@/lib/format";

export type TerritorySummary = {
  name: string;
  region: string;
  status: AfaStatus;
  since?: string;
  description?: string;
  activities: string[];
  href: string;
};

/** Fiche d'un territoire, affichée au clic sur la carte (panneau glissant sur mobile). */
export function TerritoryPanel({ territory }: { territory: TerritorySummary }) {
  return (
    <div className="space-y-4 rounded-card bg-white p-5 text-ink shadow-raised ring-1 ring-rule">
      <div className="space-y-2">
        <StatusPill status={territory.status} />
        <h3 className="font-display text-h3 font-semibold text-forest">{territory.name}</h3>
        <p className="text-meta text-ink-soft">Région : {territory.region}</p>
      </div>
      {territory.since && (
        <p className="flex items-center gap-2 text-ink-soft">
          <CalendarDays className="size-5 text-afa" aria-hidden="true" />
          Depuis le {formatDate(territory.since)}
        </p>
      )}
      {territory.description && <p>{territory.description}</p>}
      {territory.activities.length > 0 && (
        <div>
          <p className="mb-2 flex items-center gap-2 font-semibold">
            <Users className="size-5 text-afa" aria-hidden="true" />
            Activités
          </p>
          <ul className="list-inside list-disc text-ink-soft">
            {territory.activities.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      )}
      <Button href={territory.href} variant="secondary" className="w-full">
        Voir le territoire
      </Button>
    </div>
  );
}
