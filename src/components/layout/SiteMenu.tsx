"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { links, menuNav } from "@/config/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/**
 * Bouton « Menu » et menu plein écran (fenêtre modale native : focus piégé, Échap pour fermer,
 * retour du focus sur le bouton). Masqué sur ordinateur sauf `alwaysVisible` (accueil).
 */
export function SiteMenu({ current, alwaysVisible = false }: { current?: string; alwaysVisible?: boolean }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  const isCurrent = (href: string) =>
    current !== undefined &&
    (href === "/" ? current === "/" : current === href || current.startsWith(`${href}/`));

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Ouvrir le menu"
        className={cn(
          "flex min-h-12 min-w-12 cursor-pointer items-center justify-center gap-3 rounded-full px-1.5 text-[12.5px] font-bold tracking-[0.06em] text-(--hfg)",
          !alwaysVisible && "lg:hidden",
        )}
      >
        <span aria-hidden="true" className={cn(!alwaysVisible && "hidden sm:inline")}>
          MENU
        </span>
        <svg width="26" height="14" viewBox="0 0 26 14" aria-hidden="true">
          <path
            d="M1 2 H25 M9 12 H25"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Menu"
        className="on-dark m-0 h-dvh max-h-none w-full max-w-none overflow-y-auto bg-ink p-0 text-sand backdrop:bg-ink/60"
      >
        <div className="mx-auto flex min-h-full max-w-6xl flex-col gap-8 px-5 py-4 sm:px-8 sm:py-6 motion-safe:animate-[afaPop_.45s_var(--ease-afa)_both]">
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              aria-label={`${site.shortName} — accueil`}
              className="flex items-center gap-2.5 rounded-full"
            >
              <Image
                src={site.logos.mark}
                alt=""
                width={52}
                height={52}
                className="size-[52px] object-contain"
              />
              <span className="text-[22px] font-extrabold tracking-[-0.02em]">
                AFA<sup className="ml-0.5 text-[10px] font-bold">CI</sup>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex min-h-12 cursor-pointer items-center gap-3 rounded-full border-[1.5px] border-sand/40 px-5 text-[12.5px] font-bold tracking-[0.06em] uppercase hover:bg-sand hover:text-ink"
            >
              Fermer
              <svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                <path
                  d="M1 1 L13 13 M13 1 L1 13"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>

          <nav aria-label="Menu principal" className="flex-1">
            <ol className="grid gap-x-10 sm:grid-cols-2">
              {menuNav.map((item, i) => {
                const active = isCurrent(item.href);
                return (
                  <li key={item.href} className="border-b border-sand/15">
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="group flex min-h-16 items-baseline gap-4 py-3 text-[clamp(28px,4.2vw,44px)] leading-none font-extrabold tracking-[-0.03em] hover:text-accent aria-[current=page]:text-accent"
                    >
                      <span className="font-ink text-[0.5em] font-normal tracking-normal text-mint">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ol>
          </nav>

          <div className="flex flex-wrap items-end justify-between gap-6 pb-[calc(1rem+env(safe-area-inset-bottom))]">
            <p className="hand max-w-[14ch] text-[40px] text-mint">{site.slogan}</p>
            <Link
              href={links.join}
              onClick={() => setOpen(false)}
              className="inline-flex min-h-16 items-center gap-3 rounded-full border-[1.5px] border-ink bg-accent px-8 text-[18px] font-extrabold text-ink hover:bg-accent-hover"
            >
              Rejoindre AFA
              <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                <path
                  d="M1 7 H20 M14 1 L20 7 L14 13"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </div>
        </div>
      </dialog>
    </>
  );
}
