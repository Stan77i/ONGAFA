"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

type Theme = "light" | "dark";
const KEY = "afa:theme";

function read(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}
function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  return () => mo.disconnect();
}
function apply(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem(KEY, t);
  } catch {
    /* navigation privée : le choix ne sera pas mémorisé */
  }
}

/** Sélecteur jour / nuit (soleil, lune), à la manière d'un interrupteur segmenté. */
export function ThemeToggle({ className, onDark = false }: { className?: string; onDark?: boolean }) {
  const theme = useSyncExternalStore(subscribe, read, () => "light" as Theme);
  const btn = (t: Theme, label: string, icon: React.ReactNode) => (
    <button
      type="button"
      onClick={() => apply(t)}
      aria-pressed={theme === t}
      aria-label={label}
      title={label}
      className={cn(
        "grid size-9 cursor-pointer place-items-center rounded-full transition-colors duration-200",
        theme === t
          ? onDark
            ? "bg-sand text-ink"
            : "bg-(--hfg) text-(--hbg)"
          : "opacity-70 hover:opacity-100",
      )}
    >
      {icon}
    </button>
  );
  return (
    <div
      role="group"
      aria-label="Thème d'affichage"
      className={cn(
        "flex items-center gap-0.5 rounded-full border-[1.5px] border-current p-[3px]",
        className,
      )}
    >
      {btn(
        "light",
        "Mode jour",
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" fill="currentColor" />
          <path
            d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M4.9 19.1l1.8-1.8M17.3 6.7l1.8-1.8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>,
      )}
      {btn(
        "dark",
        "Mode nuit",
        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z" fill="currentColor" />
        </svg>,
      )}
    </div>
  );
}
