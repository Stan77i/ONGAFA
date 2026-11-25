"use client";

import { useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import type { AfaMapPoint } from "@/lib/map/data";
import { formatDate } from "@/lib/format";
import { StatusPill } from "./StatusPill";

/**
 * Couche d'interaction de la carte : la carte (SVG rendu côté serveur) est passée en `children`.
 * Clic, Entrée ou Espace sur une région AFA → fiche du territoire. Une liste équivalente est fournie
 * à côté pour les lecteurs d'écran et la navigation au clavier.
 */
export function NationalMapExplorer({ points, children }: { points: AfaMapPoint[]; children: ReactNode }) {
  const [selected, setSelected] = useState<string | null>(points[0]?.slug ?? null);
  const panelRef = useRef<HTMLDivElement>(null);
  const current = points.find((p) => p.slug === selected) ?? null;

  const choose = (slug: string | undefined, scroll = false) => {
    if (!slug) return;
    setSelected(slug);
    if (scroll && window.matchMedia("(max-width: 1023px)").matches) {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  };
  const slugFrom = (target: EventTarget) =>
    (target as Element).closest?.("[data-slug]")?.getAttribute("data-slug") ?? undefined;
  const onClick = (e: MouseEvent) => choose(slugFrom(e.target), true);
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      const slug = slugFrom(e.target);
      if (slug) {
        e.preventDefault();
        choose(slug, true);
      }
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
      {/* Mise en évidence de la région sélectionnée (règle générée, pas de modification du SVG serveur) */}
      {selected && (
        <style>{`.afa-region[data-slug="${selected}"]{stroke-width:6;filter:drop-shadow(0 4px 6px rgb(29 36 23 / .35))}.afa-region:focus-visible{stroke:#e9b44c;stroke-width:7}`}</style>
      )}
      <div
        onClick={onClick}
        onKeyDown={onKeyDown}
        className="rounded-card bg-white p-3 ring-1 ring-rule sm:p-6"
      >
        {children}
      </div>

      <div className="space-y-6">
        <div ref={panelRef} aria-live="polite" className="scroll-mt-24">
          {current ? (
            <article className="space-y-4 rounded-card bg-white p-5 text-ink shadow-raised ring-1 ring-rule">
              <StatusPill status={current.status} />
              <div>
                <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">Région</p>
                <h3 className="font-display text-h3 font-semibold text-forest">{current.name}</h3>
              </div>
              {current.sinceDate && (
                <p className="text-ink-soft">Depuis le {formatDate(current.sinceDate)}</p>
              )}
              {current.description && <p>{current.description}</p>}
              {current.activities.length > 0 && (
                <ul className="list-inside list-disc space-y-1 text-ink-soft">
                  {current.activities.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              )}
            </article>
          ) : (
            <p className="text-ink-soft">Aucune implantation publiée pour le moment.</p>
          )}
        </div>

        {points.length > 0 && (
          <nav aria-label="Implantations AFA">
            <ul className="space-y-2">
              {points.map((p) => (
                <li key={p.slug}>
                  <button
                    type="button"
                    onClick={() => choose(p.slug, true)}
                    aria-pressed={p.slug === selected}
                    className="flex min-h-12 w-full items-center justify-between gap-3 rounded-card bg-white px-4 py-2 text-left font-semibold text-ink ring-1 ring-rule hover:ring-afa aria-pressed:ring-2 aria-pressed:ring-forest"
                  >
                    <span>{p.name}</span>
                    <StatusPill status={p.status} />
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
