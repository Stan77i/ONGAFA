import Link from "next/link";
import { CalendarClock } from "lucide-react";
import { Badge, VerifiedBadge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/format";

export type OpportunitySummary = {
  href: string;
  title: string;
  kind: string; // Financement, Formation, Appel à projets…
  organization: string;
  deadline?: string;
  verified: boolean; // validée par AFA (lutte contre les fausses opportunités)
};

export function OpportunityCard({ opportunity }: { opportunity: OpportunitySummary }) {
  return (
    <article className="group relative flex flex-col gap-3 rounded-card bg-white text-ink p-5 ring-1 ring-rule transition-shadow hover:shadow-raised">
      <div className="flex flex-wrap gap-2">
        <Badge tone="category">{opportunity.kind}</Badge>
        {opportunity.verified && <VerifiedBadge />}
      </div>
      <h3 className="font-display text-h3 font-semibold text-forest">
        <Link
          href={opportunity.href}
          className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
        >
          {opportunity.title}
        </Link>
      </h3>
      <p className="text-ink-soft">{opportunity.organization}</p>
      {opportunity.deadline && (
        <p className="mt-auto flex items-center gap-2 font-semibold text-accent-text">
          <CalendarClock className="size-5" aria-hidden="true" />
          Date limite : <time dateTime={opportunity.deadline}>{formatDate(opportunity.deadline)}</time>
        </p>
      )}
    </article>
  );
}
