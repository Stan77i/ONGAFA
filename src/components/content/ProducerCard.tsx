import Link from "next/link";
import { MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";

export type ProducerSummary = {
  href: string;
  name: string; // nom ou nom d'exploitation
  place: string; // village ou ville UNIQUEMENT (jamais la position exacte)
  crops: string[];
  verified: boolean;
  photo?: string;
};

/** Carte producteur de l'annuaire (réservé aux membres connectés). Aucune coordonnée privée ici. */
export function ProducerCard({ producer }: { producer: ProducerSummary }) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-card bg-white text-ink p-4 ring-1 ring-rule transition-shadow hover:shadow-raised">
      <div className="flex items-center gap-3">
        <Avatar name={producer.name} src={producer.photo} size={56} />
        <div className="min-w-0">
          <h3 className="font-semibold text-ink">
            <Link
              href={producer.href}
              className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
            >
              {producer.name}
            </Link>
          </h3>
          <p className="flex items-center gap-1 text-meta text-ink-soft">
            <MapPin className="size-4" aria-hidden="true" />
            {producer.place}
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
        {producer.verified && <VerifiedBadge />}
        {producer.crops.map((c) => (
          <Badge key={c} tone="crop">
            {c}
          </Badge>
        ))}
      </div>
    </article>
  );
}
