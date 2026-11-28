"use client";

import { useEffect, useMemo, useState } from "react";
import { markVeilleSeen, veilleSeenAt } from "@/lib/search/client";
import { NewsListItem } from "@/components/content/NewsListItem";
import type { NewsEntry, Option } from "@/lib/content/data";
import { cn } from "@/lib/cn";

const PAGE = 12;

function Pills({
  label,
  all,
  options,
  value,
  onChange,
  size = "md",
}: {
  label: string;
  all: string;
  options: Option[];
  value: string | null;
  onChange: (v: string | null) => void;
  size?: "md" | "sm";
}) {
  const items = [{ slug: null as string | null, name: all }, ...options];
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-2">
      {items.map((it) => {
        const active = it.slug === value;
        return (
          <button
            key={it.slug ?? "tout"}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(it.slug)}
            className={cn(
              "inline-flex min-h-11 cursor-pointer items-center rounded-full border-[1.5px] border-ink px-[18px] font-bold whitespace-nowrap transition-colors duration-200",
              size === "sm" ? "text-[14px]" : "text-[15px]",
              active ? "bg-ink text-sand" : "text-ink hover:bg-ink/8",
            )}
          >
            {it.name}
          </button>
        );
      })}
    </div>
  );
}

/**
 * Veille filtrable dans le navigateur (site statique : les données sont intégrées à la page au moment
 * de la publication, rafraîchie automatiquement plusieurs fois par jour).
 * Porte aussi le titre de la section, pour placer les filtres par culture à côté.
 */
export function NewsExplorer({
  items,
  categories,
  crops,
  headingId,
}: {
  items: NewsEntry[];
  categories: Option[];
  crops: Option[];
  headingId: string;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [crop, setCrop] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);
  // Informations parues depuis la dernière visite de la veille (mémoire de ce navigateur).
  const [seenAt, setSeenAt] = useState<number | null>(null);
  useEffect(() => {
    const raf = requestAnimationFrame(() => setSeenAt(veilleSeenAt()));
    const t = window.setTimeout(markVeilleSeen, 2500);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(t);
    };
  }, []);

  const filtered = useMemo(
    () =>
      items.filter(
        (it) =>
          (!category || it.category?.slug === category) && (!crop || it.crops.some((c) => c.slug === crop)),
      ),
    [items, category, crop],
  );
  const reset = (fn: () => void) => {
    fn();
    setShown(PAGE);
  };
  const cropLabel = crop
    ? (crops.find((c) => c.slug === crop)?.name ?? "Toutes les cultures")
    : "Toutes les cultures";
  const filteredOut = filtered.length === 0 && items.length > 0;

  return (
    <div>
      <div className="mb-[clamp(24px,3vw,40px)] flex flex-wrap items-end justify-between gap-5">
        <div className="flex max-w-[760px] flex-col gap-3.5">
          <p className="eyebrow text-accent-text">Information agricole</p>
          <h2 id={headingId} className="h-section">
            La veille du vivrier.
          </h2>
        </div>
        {crops.length > 0 && (
          <Pills
            label="Filtrer par culture"
            all="Toutes les cultures"
            options={crops}
            value={crop}
            onChange={(v) => reset(() => setCrop(v))}
          />
        )}
      </div>
      {categories.length > 0 && items.length > 0 && (
        <div className="mb-6">
          <Pills
            size="sm"
            label="Filtrer par thème"
            all="Tous les thèmes"
            options={categories}
            value={category}
            onChange={(v) => reset(() => setCategory(v))}
          />
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {filtered.length === 0
          ? "Aucune information"
          : `${filtered.length} information${filtered.length > 1 ? "s" : ""}`}
        {(category || crop) && " pour ces filtres"}
      </p>

      {filtered.length === 0 ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(20px,3vw,40px)] rounded-[22px] border-[1.5px] border-dashed border-ink bg-white p-[clamp(24px,3vw,44px)]">
          <div className="flex flex-col gap-3">
            <span className="self-start rounded-full bg-cream px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.06em] uppercase">
              {cropLabel}
            </span>
            <h3 className="text-[clamp(24px,2.4vw,34px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {filteredOut
                ? "Rien pour ces filtres pour le moment."
                : "Aucune information publiée pour le moment."}
            </h3>
            <p className="max-w-[52ch] text-[17px] leading-[1.55] text-ink-soft">
              {filteredOut
                ? "Essayez une autre culture ou un autre thème."
                : "Les premières informations apparaîtront ici dès leur publication, collectées toutes les deux heures auprès de l'AIP, du CNRA, de l'ANADER et de la presse ivoirienne."}
            </p>
            <span className="hand mt-1 text-[38px] text-pen">les nouvelles arrivent…</span>
          </div>
          <ul aria-hidden="true" data-fx-skip="" className="flex flex-col gap-3">
            {[1, 0.6, 0.3].map((o) => (
              <li
                key={o}
                className="grid grid-cols-[56px_1fr] items-center gap-3.5 rounded-2xl bg-sand p-3.5"
                style={{ opacity: o }}
              >
                <span className="size-14 rounded-xl bg-cream" />
                <span className="flex flex-col gap-2">
                  <span className="h-3 w-4/5 rounded-md bg-rule" />
                  <span className="h-2.5 w-[55%] rounded-md bg-rule" />
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.slice(0, shown).map((it) => (
            <li key={it.id} className="flex">
              <NewsListItem item={it} isNew={seenAt !== null && Date.parse(it.publishedAt) > seenAt} />
            </li>
          ))}
        </ul>
      )}
      {shown < filtered.length && (
        <div className="mt-8 text-center">
          <button
            type="button"
            onClick={() => setShown((n) => n + PAGE)}
            className="inline-flex min-h-[52px] cursor-pointer items-center rounded-full border-[1.5px] border-ink px-[26px] font-bold hover:bg-ink hover:text-sand"
          >
            Voir plus d&apos;informations
          </button>
        </div>
      )}
    </div>
  );
}
