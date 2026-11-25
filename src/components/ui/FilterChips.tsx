import Link from "next/link";
import { cn } from "@/lib/cn";

/** Filtres en pastilles (catégories de la veille, cultures…). Liens réels : partageables et indexables. */
export function FilterChips({
  label,
  items,
  activeValue,
}: {
  label: string;
  items: { value: string; label: string; href: string }[];
  activeValue?: string;
}) {
  return (
    <nav aria-label={label} className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none]">
      <ul className="flex w-max gap-2">
        {items.map((it) => {
          const active = it.value === activeValue;
          return (
            <li key={it.value}>
              <Link
                href={it.href}
                aria-current={active ? "true" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border-2 px-4 font-semibold whitespace-nowrap transition-colors",
                  active
                    ? "border-forest bg-forest text-white"
                    : "border-rule bg-white text-ink-soft hover:border-afa hover:text-afa",
                )}
              >
                {it.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
