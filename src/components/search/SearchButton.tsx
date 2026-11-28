"use client";

import { openSearch } from "@/lib/search/client";
import { cn } from "@/lib/cn";

/** Icône loupe : ouvre la recherche instantanée (également au clavier : « / », Ctrl+K ou ⌘K). */
export function SearchButton({ className, label = false }: { className?: string; label?: boolean }) {
  return (
    <button
      type="button"
      onClick={openSearch}
      aria-label="Rechercher (raccourci : /)"
      aria-keyshortcuts="Control+K Meta+K /"
      title="Rechercher (/ ou Ctrl+K)"
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
