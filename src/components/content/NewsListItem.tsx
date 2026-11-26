import { ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import type { NewsEntry } from "@/lib/content/data";
import { formatDate } from "@/lib/format";

/**
 * Élément de veille externe : titre, extrait court, source, date, lien vers l'article d'origine.
 * Pas d'image (droits) : la lecture reste rapide sur mobile.
 */
export function NewsListItem({ item }: { item: NewsEntry }) {
  return (
    <article className="group relative flex flex-col gap-2 rounded-card bg-white p-5 text-ink ring-1 ring-rule transition-shadow hover:shadow-raised">
      <div className="flex flex-wrap items-center gap-2">
        {item.category && <Badge tone="category">{item.category.name}</Badge>}
        {item.crops.map((c) => (
          <Badge key={c.slug} tone="crop">
            {c.name}
          </Badge>
        ))}
      </div>
      <h3 className="font-display text-xl leading-snug font-semibold text-forest">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
        >
          {item.title}
          <span className="sr-only"> (ouvre le site de la source dans un nouvel onglet)</span>
        </a>
      </h3>
      {item.excerpt && <p className="line-clamp-3 text-ink-soft">{item.excerpt}</p>}
      <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-1 text-meta text-ink-soft">
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1 font-semibold text-afa">
          {item.source}
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </p>
    </article>
  );
}
