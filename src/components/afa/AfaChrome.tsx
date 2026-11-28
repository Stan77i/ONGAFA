"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { links, mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { useAfaFx } from "./useAfaFx";
import { NewsBadge } from "@/components/search/NewsBadge";
import { SearchButton } from "@/components/search/SearchButton";

/**
 * Habillage vivant commun à toutes les pages :
 *  - barre de navigation flottante (ordinateur), qui apparaît après le premier écran ;
 *  - barre de progression de lecture (orange) ;
 *  - bouton « Revenir en haut » ;
 *  - effets au défilement et au survol (useAfaFx).
 */
export function AfaChrome() {
  const pathname = usePathname() ?? "";
  const [bar, setBar] = useState(false);
  const [top, setTop] = useState(false);
  const progRef = useRef<HTMLDivElement>(null);

  useAfaFx(pathname);

  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const h = document.documentElement.scrollHeight - window.innerHeight;
        setBar(y > window.innerHeight * 0.7);
        setTop(y > window.innerHeight * 1.5);
        if (progRef.current) progRef.current.style.transform = `scaleX(${h > 0 ? Math.min(1, y / h) : 0})`;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <div
        ref={progRef}
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 z-[71] h-[3px] w-full origin-left scale-x-0 bg-accent"
      />
      <div
        // Hors écran tant qu'elle est masquée : `inert` la retire du clavier et des lecteurs d'écran.
        inert={!bar}
        className={cn(
          "fixed top-3 left-1/2 z-[70] hidden max-w-[calc(100vw-24px)] -translate-x-1/2 items-center gap-1.5 rounded-full bg-ink/92 py-1.5 pr-1.5 pl-2 shadow-[0_10px_30px_rgba(29,36,23,0.25)] backdrop-blur-[10px] transition-transform duration-500 ease-(--ease-afa) lg:flex",
          bar ? "translate-y-0" : "-translate-y-[140%]",
        )}
      >
        <Link href="/" aria-label={`${site.shortName} — accueil`} className="flex rounded-full pr-1.5">
          <Image
            src={site.logos.mark}
            alt=""
            width={40}
            height={40}
            className="-my-1 size-10 object-contain"
          />
        </Link>
        <nav aria-label="Navigation rapide" className="no-scrollbar flex gap-0.5 overflow-x-auto">
          {mainNav
            .filter((i) => i.header)
            .map((item) => (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isCurrent(item.href) ? "page" : undefined}
                className="flex min-h-10 items-center rounded-full px-3.5 text-[12px] font-bold tracking-[0.06em] whitespace-nowrap text-sand uppercase hover:bg-sand/12 hover:text-white aria-[current=page]:bg-sand aria-[current=page]:text-ink"
              >
                {item.label}
                {item.href === "/veille" && <NewsBadge />}
              </Link>
            ))}
        </nav>
        <SearchButton className="min-h-10 min-w-10 text-sand hover:bg-sand/12" />
        <Link
          href={links.join}
          className="flex min-h-10 items-center rounded-full bg-accent px-3.5 text-[12px] font-bold tracking-[0.06em] whitespace-nowrap text-ink uppercase hover:bg-accent-hover"
        >
          Rejoindre
        </Link>
      </div>
      <button
        type="button"
        aria-label="Revenir en haut"
        tabIndex={top ? 0 : -1}
        aria-hidden={!top}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed right-3 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[70] grid size-[52px] cursor-pointer place-items-center rounded-full border-[1.5px] border-ink bg-sand text-ink shadow-[0_5px_0_#1d2417] transition-[opacity,transform] duration-300 ease-(--ease-afa) lg:right-5 lg:bottom-5",
          top
            ? "translate-y-0 opacity-100 hover:-translate-y-[3px]"
            : "pointer-events-none translate-y-5 opacity-0",
        )}
      >
        <svg width="18" height="22" viewBox="0 0 18 22" aria-hidden="true">
          <path
            d="M9 20V2M2 9l7-7 7 7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </>
  );
}
