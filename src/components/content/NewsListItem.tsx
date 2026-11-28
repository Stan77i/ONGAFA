import type { NewsEntry } from "@/lib/content/data";
import { formatDate } from "@/lib/format";

/**
 * Élément de veille externe : titre, extrait court, source, date, lien vers l'article d'origine.
 * Pas d'image (droits) : la lecture reste rapide sur mobile.
 */
export function NewsListItem({ item }: { item: NewsEntry }) {
  return (
    <article className="afa-card sticker group relative flex w-full flex-col gap-2.5 bg-white p-6 text-ink">
      {(item.category || item.crops.length > 0) && (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.category && (
            <span className="rounded-full bg-cream px-3 py-1 text-[12px] font-extrabold tracking-[0.06em] uppercase">
              {item.category.name}
            </span>
          )}
          {item.crops.map((c) => (
            <span
              key={c.slug}
              className="rounded-full border-[1.5px] border-afa px-3 py-0.5 text-[12px] font-bold text-afa"
            >
              {c.name}
            </span>
          ))}
        </div>
      )}
      <h3 className="text-[20px] leading-snug font-extrabold tracking-[-0.015em]">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="after:absolute after:inset-0 after:rounded-[22px] group-hover:underline"
        >
          {item.title}
          <span className="sr-only"> (ouvre le site de la source dans un nouvel onglet)</span>
        </a>
      </h3>
      {item.excerpt && (
        <p className="line-clamp-3 text-[16px] leading-normal text-ink-soft">{item.excerpt}</p>
      )}
      <p className="mt-auto flex flex-wrap items-center gap-x-2 pt-1 text-[14px] text-ink-soft">
        <time dateTime={item.publishedAt}>{formatDate(item.publishedAt)}</time>
        <span aria-hidden="true">·</span>
        <span className="inline-flex items-center gap-1 font-bold text-forest">
          {item.source}
          <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
            <path
              d="M3 11 L11 3 M5 3 H11 V9"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </p>
    </article>
  );
}
