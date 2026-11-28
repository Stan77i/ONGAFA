"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { House, Landmark, Layers, Map, MessagesSquare, Newspaper, Sprout, UserRound } from "lucide-react";
import { mobileTabs } from "@/config/navigation";
import { cn } from "@/lib/cn";
import { NewsBadge } from "@/components/search/NewsBadge";

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
 * Même découpage que l'en-tête : `MobileTabBarView` (pur) sert de repli sous <Suspense>.
 */
export function MobileTabBar() {
  return <MobileTabBarView pathname={usePathname()} />;
}

export function MobileTabBarView({ pathname = "" }: { pathname?: string }) {
  return (
    <nav
      aria-label="Navigation rapide"
      className="fixed inset-x-2 bottom-[calc(6px+env(safe-area-inset-bottom))] z-40 rounded-full bg-ink/95 shadow-[0_10px_30px_rgba(29,36,23,0.35)] ring-1 ring-sand/15 backdrop-blur-md lg:hidden"
    >
      <ul
        className="mx-auto grid h-16 max-w-lg px-1.5"
        style={{ gridTemplateColumns: `repeat(${mobileTabs.length}, minmax(0, 1fr))` }}
      >
        {mobileTabs.map((tab) => {
          const Icon = icons[tab.icon];
          const active =
            pathname !== "" && (tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href));
          return (
            <li key={tab.href} className="flex items-center">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex h-[52px] w-full flex-col items-center justify-center gap-0.5 rounded-full text-[11px] font-bold tracking-[0.02em] transition-colors",
                  active ? "bg-sand text-ink" : "text-sand/85 hover:text-white",
                )}
              >
                <span className="relative">
                  <Icon className="size-5" aria-hidden="true" strokeWidth={active ? 2.4 : 2} />
                  {tab.href === "/veille" && (
                    <NewsBadge className="absolute -top-1.5 -right-3 grid min-w-[18px] place-items-center rounded-full bg-accent px-1 text-[10px] leading-[18px] font-extrabold text-ink" />
                  )}
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
