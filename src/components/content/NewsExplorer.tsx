"use client";

import { useMemo, useState } from "react";
import { NewsListItem } from "@/components/content/NewsListItem";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import type { NewsEntry, Option } from "@/lib/content/data";
import { cn } from "@/lib/cn";

const PAGE = 12;

function Chips({
  label,
  all,
  options,
  value,
  onChange,
}: {
  label: string;
  all: string;
  options: Option[];
  value: string | null;
  onChange: (v: string | null) => void;
}) {
  const items = [{ slug: null as string | null, name: all }, ...options];
  return (
    <div role="group" aria-label={label} className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {items.map((it) => {
          const active = it.slug === value;
          return (
            <li key={it.slug ?? "tout"}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => onChange(it.slug)}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border-2 px-4 font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "border-forest bg-forest text-white"
                    : "border-rule bg-white text-ink-soft hover:border-afa hover:text-afa",
                )}
              >
                {it.name}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/**
 * Veille filtrable dans le navigateur (site statique : les données sont intégrées à la page au moment
 * de la publication, rafraîchie automatiquement plusieurs fois par jour).
 */
export function NewsExplorer({
  items,
  categories,
  crops,
}: {
  items: NewsEntry[];
  categories: Option[];
  crops: Option[];
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [crop, setCrop] = useState<string | null>(null);
  const [shown, setShown] = useState(PAGE);

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

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <Chips
          label="Filtrer par thème"
          all="Tous les thèmes"
          options={categories}
          value={category}
          onChange={(v) => reset(() => setCategory(v))}
        />
        <Chips
          label="Filtrer par culture"
          all="Toutes les cultures"
          options={crops}
          value={crop}
          onChange={(v) => reset(() => setCrop(v))}
        />
      </div>
      <p className="text-meta text-ink-soft" aria-live="polite">
        {filtered.length === 0
          ? "Aucune information"
          : `${filtered.length} information${filtered.length > 1 ? "s" : ""}`}
        {(category || crop) && " pour ces filtres"}
      </p>
      {filtered.length === 0 ? (
        <EmptyState
          title={category || crop ? "Rien pour ces filtres pour le moment" : "La veille se remplit"}
        >
          {category || crop
            ? "Essayez un autre thème ou une autre culture."
            : "Les informations sont collectées automatiquement auprès de nos sources."}
        </EmptyState>
      ) : (
        <ul className="grid gap-4 md:grid-cols-2">
          {filtered.slice(0, shown).map((it) => (
            <li key={it.id} className="flex">
              <NewsListItem item={it} />
            </li>
          ))}
        </ul>
      )}
      {shown < filtered.length && (
        <div className="text-center">
          <Button variant="secondary" onClick={() => setShown((n) => n + PAGE)}>
            Voir plus d&apos;informations
          </Button>
        </div>
      )}
    </div>
  );
}
