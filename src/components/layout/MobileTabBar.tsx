"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Landmark, Layers, Map, MessagesSquare, Newspaper, Sprout, UserRound } from "lucide-react";
import { mobileTabs } from "@/config/navigation";
import { cn } from "@/lib/cn";

const icons = {
  home: House,
  landmark: Landmark,
  layers: Layers,
  sprout: Sprout,
  newspaper: Newspaper,
  map: Map,
  messages: MessagesSquare,
  user: UserRound,
} as const;

/**
 * Barre de navigation basse (mobile et tablette uniquement), à portée du pouce.
 * La page doit réserver l'espace en bas : classe `pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0`.
 */
export function MobileTabBar() {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-rule bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul
        className="mx-auto grid h-[4.5rem] max-w-lg"
        style={{ gridTemplateColumns: `repeat(${mobileTabs.length}, minmax(0, 1fr))` }}
      >
        {mobileTabs.map((tab) => {
          const Icon = icons[tab.icon];
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          return (
            <li key={tab.href}>
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-full flex-col items-center justify-center gap-1 text-xs font-semibold",
                  active ? "text-forest" : "text-ink-soft",
                )}
              >
                <span
                  className={cn(
                    "grid h-8 w-14 place-items-center rounded-full transition-colors",
                    active && "bg-leaf/15",
                  )}
                >
                  <Icon className="size-5" aria-hidden="true" strokeWidth={active ? 2.4 : 2} />
                </span>
                {tab.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
