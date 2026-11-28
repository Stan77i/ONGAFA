"use client";

import { useEffect, useState } from "react";
import type { NewsEntry } from "@/lib/content/data";
import { formatDate } from "@/lib/format";

/**
 * Annonce défilante des dernières informations, fixée en bas de l'écran tant que la section
 * `targetId` est à l'écran (au-dessus de la barre basse sur mobile). Survol ou focus = pause.
 */
export function NewsTicker({ items, targetId = "veille" }: { items: NewsEntry[]; targetId?: string }) {
  const [shown, setShown] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShown(e.isIntersecting), {
      rootMargin: "0px 0px -35% 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [targetId]);

  const list = items.slice(0, 8);
  if (list.length === 0) return null;
  const loop = [...list, ...list];

  return (
    <aside
      aria-label="Dernières informations de la veille"
      aria-hidden={!shown}
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] left-1/2 z-40 w-[min(1100px,calc(100%-32px))] overflow-hidden rounded-full border-2 border-ink bg-ink text-sand shadow-[0_6px_0_rgba(29,36,23,.35),0_14px_30px_rgba(29,36,23,.25)] transition-[transform,opacity] duration-500 ease-(--ease-afa) lg:bottom-4"
      style={{
        transform: `translate(-50%, ${shown ? "0" : "140%"})`,
        opacity: shown ? 1 : 0,
        pointerEvents: shown ? "auto" : "none",
      }}
    >
      <div
        className="overflow-hidden"
        style={{
          maskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
          WebkitMaskImage: "linear-gradient(90deg,transparent,#000 6%,#000 94%,transparent)",
        }}
      >
        <ul
          className="flex w-max"
          style={{
            animation: "afaTicker 46s linear infinite",
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {loop.map((it, i) => (
            <li key={`${it.id}-${i}`} aria-hidden={i >= list.length || undefined}>
              <a
                href={it.url}
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={shown && i < list.length ? 0 : -1}
                className="inline-flex min-h-12 items-center gap-3 border-r-[1.5px] border-sand/20 px-7 text-[15px] font-bold whitespace-nowrap hover:text-accent-hover"
              >
                <span className="text-leaf-light">
                  {formatDate(it.publishedAt)} · {it.source}
                </span>
                <span>{it.title}</span>
                <span className="sr-only"> (nouvel onglet)</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
