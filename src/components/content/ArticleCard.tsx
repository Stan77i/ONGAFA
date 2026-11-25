import Link from "next/link";
import { ExternalSourceBadge, Badge } from "@/components/ui/Badge";
import { MediaFrame, type Media } from "@/components/ui/MediaFrame";
import { cn } from "@/lib/cn";
import { formatDate } from "@/lib/format";

export type ArticleSummary = {
  href: string;
  title: string;
  excerpt: string;
  category: string;
  publishedAt: string;
  source: string; // « ONG AFA » ou nom de la source externe
  external?: boolean; // contenu de veille externe
  media?: Media | null;
};

/** Carte d'article / de veille. Toute la carte est cliquable via le titre (un seul lien, accessible). */
export function ArticleCard({ article, featured = false }: { article: ArticleSummary; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative flex flex-col gap-4 rounded-card bg-white text-ink p-3 ring-1 ring-rule transition-shadow hover:shadow-raised",
        featured && "md:col-span-2 md:grid md:grid-cols-2 md:items-center md:gap-8 md:p-4",
      )}
    >
      <MediaFrame
        media={article.media}
        ratio={featured ? "aspect-[4/3]" : "aspect-[16/10]"}
        priority={featured}
      />
      <div className="flex flex-1 flex-col gap-2 px-1 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="category">{article.category}</Badge>
          {article.external && <ExternalSourceBadge />}
        </div>
        <h3 className={cn("font-display font-semibold text-forest", featured ? "text-h2" : "text-h3")}>
          <Link
            href={article.href}
            className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
          >
            {article.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-ink-soft">{article.excerpt}</p>
        <p className="mt-auto pt-2 text-meta text-ink-soft">
          <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time> · {article.source}
        </p>
      </div>
    </article>
  );
}
