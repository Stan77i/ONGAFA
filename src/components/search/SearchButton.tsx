"use client";

import { openSearch } from "@/lib/search/client";
import { cn } from "@/lib/cn";

/** Bouton « Rechercher » (ouvre la palette ⌘K). */
export function SearchButton({
  className,
  label = false,
  bar = false,
}: {
  className?: string;
  label?: boolean;
  /** Barre de recherche visible (« Rechercher… ⌘K »), sur grand écran. */
  bar?: boolean;
}) {
  if (bar)
    return (
      <button
        type="button"
        onClick={openSearch}
        aria-label="Rechercher (raccourci : /)"
        aria-keyshortcuts="Control+K Meta+K /"
        className={cn(
          "flex min-h-12 w-[210px] cursor-pointer items-center gap-2.5 rounded-full border-[1.5px] border-current px-4 text-left text-[14px] font-semibold opacity-90 hover:opacity-100",
          className,
        )}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <span aria-hidden="true" className="flex-1 opacity-75">
          Rechercher…
        </span>
        <kbd
          aria-hidden="true"
          className="rounded-md border border-current px-1.5 text-[11px] font-bold opacity-70"
        >
          ⌘K
        </kbd>
      </button>
    );
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Rechercher (raccourci : /)"
      aria-keyshortcuts="Control+K Meta+K /"
      className={cn(
        "flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-2 rounded-full text-[12.5px] font-bold tracking-[0.06em] uppercase",
        className,
      )}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
        <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      {label && <span aria-hidden="true">Rechercher</span>}
    </button>
  );
}
