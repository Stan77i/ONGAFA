import Image from "next/image";
import Link from "next/link";
import { links, mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { NewsBadge } from "@/components/search/NewsBadge";
import { NewsBell } from "@/components/search/NewsBell";
import { SearchButton } from "@/components/search/SearchButton";
import { ThemeToggle } from "@/components/theme/ThemeToggle";
import { SiteMenu } from "./SiteMenu";

export function isActive(current: string | undefined, href: string) {
  if (!current) return false;
  return current === href || current.startsWith(`${href}/`);
}

/**
 * En-tête, posé dans le premier panneau coloré de chaque page. Ses couleurs suivent le panneau
 * grâce aux variables CSS `--hfg` (texte, traits), `--hbg` (fond) et `--hring` (survol) :
 * sur l'accueil, elles changent avec la scène du hero.
 *
 * Ordinateur (≥ 1024 px) : logo, navigation en pilule, « Rejoindre AFA ».
 * Mobile : logo, « Rejoindre » et menu plein écran.
 * `variant="home"` : le hero porte déjà l'appel à rejoindre, l'en-tête affiche le bouton « Menu ».
 * `join` : couleur du bouton « Rejoindre AFA » (encre sur fonds clairs, orange sur fonds sombres).
 */
export function SiteHeader({
  current,
  variant = "page",
  join = "ink",
}: {
  current?: string;
  variant?: "page" | "home";
  join?: "ink" | "orange";
}) {
  const nav = mainNav.filter((i) => i.header);
  return (
    <header className="relative z-10 flex items-center justify-between gap-3 text-(--hfg) sm:gap-4">
      <div className="flex min-w-0 items-center gap-3.5 rounded-full border-[1.5px] border-current py-[5px] pr-[6px] pl-2 lg:max-w-[860px] lg:flex-[1_1_auto]">
        <Link
          href="/"
          aria-label={`${site.shortName} — accueil`}
          className="flex flex-none items-center gap-2.5 rounded-full pr-2"
        >
          <Image
            src={site.logos.mark}
            alt=""
            width={52}
            height={52}
            priority
            className="-my-1.5 -ml-0.5 size-[46px] object-contain drop-shadow-[0_2px_3px_rgba(29,36,23,0.25)] sm:size-[52px]"
          />
          <span className="text-[20px] font-extrabold tracking-[-0.02em] sm:text-[22px]">
            AFA<sup className="ml-0.5 text-[10px] font-bold">CI</sup>
          </span>
        </Link>
        <nav
          aria-label="Navigation principale"
          className="no-scrollbar ml-auto hidden min-w-0 items-center gap-0.5 overflow-x-auto rounded-full border-[1.5px] border-current p-[3px] lg:flex"
        >
          {nav.map((item) => {
            const active = isActive(current, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-10 items-center rounded-full px-3.5 text-[12.5px] font-bold tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-200",
                  active ? "bg-(--hfg) text-(--hbg)" : "hover:bg-(--hring)",
                )}
              >
                {item.label}
                {item.href === "/veille" && <NewsBadge />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-none items-center gap-1 sm:gap-2">
        <ThemeToggle className="hidden text-(--hfg) xl:flex" />
        <SearchButton className="hidden text-(--hfg) hover:bg-(--hring) sm:flex" />
        <NewsBell className="hidden text-(--hfg) sm:block" />
        {variant === "page" && (
          <Link
            href={links.join}
            aria-current={isActive(current, links.join) ? "page" : undefined}
            className={cn(
              "inline-flex min-h-12 items-center rounded-full px-4 text-[12.5px] font-extrabold tracking-[0.06em] whitespace-nowrap uppercase transition-colors duration-200 sm:px-[22px] sm:text-[13px]",
              join === "ink"
                ? "bg-ink text-sand hover:bg-forest"
                : "border-[1.5px] border-ink bg-accent text-ink hover:bg-accent-hover",
            )}
          >
            Rejoindre<span className="hidden sm:inline">&nbsp;AFA</span>
          </Link>
        )}
        <SiteMenu current={current} alwaysVisible={variant === "home"} />
      </div>
    </header>
  );
}
