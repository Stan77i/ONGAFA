import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/cn";

/** Pagination simple et robuste (liens réels : indexables, fonctionnent sans JavaScript). */
export function Pagination({
  page,
  totalPages,
  hrefFor,
}: {
  page: number;
  totalPages: number;
  hrefFor: (p: number) => string;
}) {
  if (totalPages <= 1) return null;
  const btn = "inline-flex min-h-12 items-center gap-1 rounded-full px-4 font-semibold";
  return (
    <nav aria-label="Pagination" className="flex items-center justify-between gap-3">
      {page > 1 ? (
        <Link href={hrefFor(page - 1)} rel="prev" className={cn(btn, "text-afa hover:bg-sand")}>
          <ChevronLeft className="size-5" aria-hidden="true" /> Précédent
        </Link>
      ) : (
        <span />
      )}
      <p className="text-meta text-ink-soft">
        Page {page} sur {totalPages}
      </p>
      {page < totalPages ? (
        <Link href={hrefFor(page + 1)} rel="next" className={cn(btn, "text-afa hover:bg-sand")}>
          Suivant <ChevronRight className="size-5" aria-hidden="true" />
        </Link>
      ) : (
        <span />
      )}
    </nav>
  );
}
