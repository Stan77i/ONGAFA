import Link from "next/link";
import { MediaFrame, type Media } from "@/components/ui/MediaFrame";

/** Dérivé du manioc (attiéké, gari, placali, amidon, farine…). */
export function DerivativeCard({
  name,
  description,
  href,
  media,
}: {
  name: string;
  description: string;
  href: string;
  media?: Media | null;
}) {
  return (
    <article className="group relative overflow-hidden rounded-card bg-cream ring-1 ring-rule">
      <MediaFrame
        media={media}
        ratio="aspect-square"
        className="rounded-none"
        sizes="(min-width: 768px) 25vw, 50vw"
      />
      <div className="space-y-1 p-4">
        <h3 className="font-display text-xl font-semibold text-forest">
          <Link href={href} className="after:absolute after:inset-0 group-hover:underline">
            {name}
          </Link>
        </h3>
        <p className="text-meta text-ink-soft">{description}</p>
      </div>
    </article>
  );
}
