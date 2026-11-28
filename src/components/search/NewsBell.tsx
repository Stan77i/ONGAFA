"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { loadSearchIndex, veilleSeenAt } from "@/lib/search/client";
import type { SearchItem } from "@/lib/search/types";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/**
 * Cloche « Nouveautés » : nombre d'informations de veille parues depuis la dernière consultation,
 * et liste déroulante des dernières informations (titre, source, date, lien vers la source).
 */
export function NewsBell({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<SearchItem[]>([]);
  const [fresh, setFresh] = useState(0);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    const compute = () =>
      loadSearchIndex().then((idx) => {
        if (!alive || !idx) return;
        const news = idx.items
          .filter((i) => i.g === "Veille" && i.d)
          .sort((a, b) => Date.parse(b.d!) - Date.parse(a.d!));
        const seen = veilleSeenAt();
        setItems(news.slice(0, 6));
        setFresh(seen === null ? 0 : news.filter((i) => Date.parse(i.d!) > seen).length);
      });
    const t = window.setTimeout(compute, 1200);
    window.addEventListener("afa:veille-vue", compute);
    return () => {
      alive = false;
      window.clearTimeout(t);
      window.removeEventListener("afa:veille-vue", compute);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!box.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const seen = typeof window === "undefined" ? null : veilleSeenAt();

  return (
    <div ref={box} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={
          fresh > 0
            ? `Nouveautés : ${fresh} nouvelle${fresh > 1 ? "s" : ""} information${fresh > 1 ? "s" : ""}`
            : "Nouveautés de la veille"
        }
        className="relative grid size-12 cursor-pointer place-items-center rounded-full hover:bg-(--hring)"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
          <path
            d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15Z M10 20.5a2.2 2.2 0 0 0 4 0"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </svg>
        {fresh > 0 && (
          <span className="absolute top-1.5 right-1 grid min-w-[18px] place-items-center rounded-full border-[1.5px] border-(--hbg) bg-accent px-1 text-[10px] leading-[15px] font-extrabold text-ink">
            {fresh > 99 ? "99+" : fresh}
          </span>
        )}
      </button>
      {open && (
        <div
          className="absolute top-[calc(100%+10px)] right-0 z-30 w-[min(380px,calc(100vw-24px))] overflow-hidden rounded-[22px] border-[1.5px] border-ink bg-sand text-ink shadow-[0_6px_0_#1d2417,0_24px_48px_rgba(0,0,0,.25)]"
          style={{ animation: "afaPop .3s cubic-bezier(.2,.8,.2,1) both" }}
        >
          <div className="flex items-center justify-between gap-3 border-b-[1.5px] border-ink/12 px-5 py-3.5">
            <p className="text-[15px] font-extrabold">Nouveautés de la veille</p>
            {fresh > 0 && (
              <span className="rounded-full bg-accent px-2.5 py-0.5 text-[12px] font-extrabold">
                {fresh} nouvelles
              </span>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-5 py-6 text-[15px] text-ink-soft">Aucune information publiée pour le moment.</p>
          ) : (
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {items.map((it) => {
                const isNew = seen !== null && Date.parse(it.d!) > seen;
                return (
                  <li key={it.href}>
                    <a
                      href={it.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex gap-3 rounded-2xl px-3 py-2.5 hover:bg-ink/6"
                    >
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-1.5 size-2 flex-none rounded-full",
                          isNew ? "bg-accent" : "bg-ink/20",
                        )}
                      />
                      <span className="min-w-0">
                        <span className="line-clamp-2 text-[14.5px] leading-snug font-bold">{it.t}</span>
                        <span className="block text-[12.5px] text-ink-soft">
                          {formatDate(it.d!)} · {it.s}
                          <span className="sr-only"> (nouvel onglet)</span>
                        </span>
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          )}
          <Link
            href="/veille"
            onClick={() => setOpen(false)}
            className="flex min-h-12 items-center justify-between border-t-[1.5px] border-ink/12 px-5 text-[14px] font-extrabold hover:bg-ink/6"
          >
            Toute la veille <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
