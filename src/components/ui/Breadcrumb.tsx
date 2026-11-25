import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type Crumb = { href: string; label: string };

/** Fil d'Ariane (les données structurées BreadcrumbList seront ajoutées en phase SEO). */
export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Fil d'Ariane" className="text-meta">
      <ol className="flex flex-wrap items-center gap-1 text-ink-soft">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.href} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="font-semibold text-ink">
                  {c.label}
                </span>
              ) : (
                <>
                  <Link
                    href={c.href}
                    className="inline-flex min-h-11 items-center hover:text-forest hover:underline"
                  >
                    {c.label}
                  </Link>
                  <ChevronRight className="size-4" aria-hidden="true" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
