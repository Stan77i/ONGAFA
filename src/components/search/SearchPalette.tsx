"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loadSearchIndex, norm } from "@/lib/search/client";
import type { SearchItem } from "@/lib/search/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

const GROUPS: SearchItem["g"][] = ["Pages", "Régions", "Manioc", "Domaines", "Veille", "Ressources"];
const SUGGEST = ["/manioc", "/veille", "/carte", "/prix", "/a-propos", "/rejoindre-afa"];

function score(it: SearchItem, words: string[]) {
  const t = norm(it.t);
  const all = `${t} ${norm(it.s ?? "")} ${norm(it.k ?? "")} ${norm(it.g)}`;
  if (!words.every((w) => all.includes(w))) return -1;
  let s = 0;
  for (const w of words) s += t.startsWith(w) ? 6 : t.includes(` ${w}`) ? 4 : t.includes(w) ? 3 : 1;
  if (it.g === "Pages") s += 2;
  return s - t.length / 200;
}

/**
 * Recherche instantanée (⌘K, Ctrl+K ou « / ») : pages, domaines, manioc, régions, veille, ressources.
 * Fenêtre modale native ; ↑ ↓ pour naviguer, Entrée pour ouvrir, Échap pour fermer.
 */
export function SearchPalette() {
  const router = useRouter();
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [active, setActive] = useState(0);

  const show = useCallback(() => {
    setOpen(true);
    loadSearchIndex().then((idx) => setItems(idx?.items ?? []));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest?.("input, textarea, select, [contenteditable]");
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        show();
      } else if (e.key === "/" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("afa:search", show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("afa:search", show);
    };
  }, [show]);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) {
      d.showModal();
      inputRef.current?.focus();
    }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    const words = norm(q).split(/\s+/).filter(Boolean);
    if (!words.length)
      return SUGGEST.map((h) => items.find((i) => i.href === h && i.g === "Pages")).filter(
        Boolean,
      ) as SearchItem[];
    return items
      .map((it) => ({ it, s: score(it, words) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 40)
      .sort((a, b) => GROUPS.indexOf(a.it.g) - GROUPS.indexOf(b.it.g))
      .map((x) => x.it);
  }, [items, q]);

  useEffect(() => {
    listRef.current?.querySelector(`[data-i="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const go = (it: SearchItem | undefined) => {
    if (!it) return;
    setOpen(false);
    setQ("");
    if (it.external) window.open(it.href, "_blank", "noopener,noreferrer");
    else router.push(it.href);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(results.length - 1, a + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(0, a - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <dialog
      ref={ref}
      onClose={() => setOpen(false)}
      onClick={(e) => e.target === ref.current && setOpen(false)}
      aria-label="Rechercher sur le site"
      className="afa-search m-auto mt-[10vh] w-[min(680px,calc(100vw-24px))] max-w-none overflow-hidden rounded-[22px] border-[1.5px] border-ink bg-sand p-0 text-ink shadow-[0_8px_0_#1d2417,0_40px_80px_rgba(0,0,0,.35)] backdrop:bg-ink/55 backdrop:backdrop-blur-[3px]"
    >
      <div className="flex items-center gap-3 border-b-[1.5px] border-ink/15 px-5">
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" className="flex-none">
          <circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" strokeWidth="2.2" />
          <path d="M16.5 16.5 L21 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
        <input
          ref={inputRef}
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setActive(0);
          }}
          onKeyDown={onKeyDown}
          placeholder="Manioc, attiéké, Nawa, prix, veille…"
          aria-label="Rechercher"
          role="combobox"
          aria-expanded="true"
          aria-controls="afa-search-list"
          aria-activedescendant={results[active] ? `afa-s-${active}` : undefined}
          aria-autocomplete="list"
          className="min-h-16 flex-1 bg-transparent text-[18px] font-semibold outline-none placeholder:text-ink-soft/70 focus-visible:shadow-none focus-visible:outline-none"
        />
        <kbd className="rounded-md border border-ink/20 px-2 py-0.5 text-[12px] font-bold text-ink-soft">
          Échap
        </kbd>
      </div>
      <ul
        ref={listRef}
        id="afa-search-list"
        role="listbox"
        aria-label="Résultats"
        className="max-h-[56vh] overflow-y-auto p-2"
      >
        {items === null && <li className="px-4 py-6 text-ink-soft">Chargement…</li>}
        {items !== null && results.length === 0 && (
          <li className="px-4 py-8 text-center">
            <p className="font-extrabold">Aucun résultat pour « {q} »</p>
            <p className="text-[15px] text-ink-soft">Essayez un autre mot : manioc, attiéké, Nawa, prix…</p>
          </li>
        )}
        {results.map((it, i) => {
          const header = i === 0 || results[i - 1].g !== it.g ? it.g : null;
          return (
            <li key={`${it.href}-${it.t}`} role="presentation">
              {header && (
                <p className="eyebrow px-3 pt-3 pb-1.5 text-accent-text" aria-hidden="true">
                  {q ? header : "Accès rapide"}
                </p>
              )}
              <div
                id={`afa-s-${i}`}
                data-i={i}
                role="option"
                aria-selected={i === active}
                onMouseMove={() => setActive(i)}
                onClick={() => go(it)}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl px-3 py-2.5",
                  i === active ? "bg-ink text-sand" : "hover:bg-ink/6",
                )}
              >
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[16px] font-extrabold tracking-[-0.01em]">{it.t}</span>
                  {it.s && (
                    <span
                      className={cn(
                        "block truncate text-[13.5px]",
                        i === active ? "text-sand/75" : "text-ink-soft",
                      )}
                    >
                      {it.d ? `${formatDate(it.d)} · ` : ""}
                      {it.s}
                    </span>
                  )}
                </span>
                <span aria-hidden="true" className="text-[18px]">
                  {it.external ? "↗" : "→"}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="flex flex-wrap gap-x-5 gap-y-1 border-t-[1.5px] border-ink/15 px-5 py-3 text-[12.5px] font-semibold text-ink-soft">
        <span>↑ ↓ naviguer</span>
        <span>↵ ouvrir</span>
        <span>Échap fermer</span>
        <span className="ml-auto">Veille : liens vers la source</span>
      </div>
    </dialog>
  );
}
