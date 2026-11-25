import Link from "next/link";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { dateParts } from "@/lib/format";

export type EventSummary = {
  href: string;
  title: string;
  startsAt: string;
  place: string;
  kind: string; // Formation, Rencontre, Journée agricole…
  registrationOpen?: boolean;
};

/** Carte d'événement avec bloc date. */
export function EventCard({ event }: { event: EventSummary }) {
  const d = dateParts(event.startsAt);
  const time = new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Abidjan",
  }).format(new Date(event.startsAt));
  return (
    <article className="group relative flex gap-4 rounded-card bg-white text-ink p-4 ring-1 ring-rule transition-shadow hover:shadow-raised">
      <time
        dateTime={event.startsAt}
        className="flex w-16 shrink-0 flex-col items-center justify-center rounded-field bg-forest py-2 text-white"
      >
        <span className="font-display text-2xl leading-none font-semibold">{d.day}</span>
        <span className="text-meta uppercase">{d.month}</span>
      </time>
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap gap-2">
          <Badge tone="category">{event.kind}</Badge>
          {event.registrationOpen && <Badge tone="crop">Inscriptions ouvertes</Badge>}
        </div>
        <h3 className="font-semibold text-ink">
          <Link
            href={event.href}
            className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
          >
            {event.title}
          </Link>
        </h3>
        <p className="flex items-center gap-1 text-meta text-ink-soft">
          <MapPin className="size-4 shrink-0" aria-hidden="true" />
          {event.place} · <span className="capitalize">{d.weekday}</span> à {time}
        </p>
      </div>
    </article>
  );
}
