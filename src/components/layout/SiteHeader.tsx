"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Menu, Search, X } from "lucide-react";
import { links, mainNav } from "@/config/navigation";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";
import { Button } from "@/components/ui/Button";

function isActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * En-tête. Ordinateur : sceau, navigation complète, recherche, « Rejoindre AFA ».
 * Mobile : symbole, recherche, « Rejoindre », menu plein écran (fenêtre modale native : focus piégé, Échap).
 * `account` : lien de compte rendu côté serveur (selon la session), affiché sur ordinateur ;
 * sur mobile, le compte est dans la barre de navigation basse.
 *
 * Deux composants : `SiteHeaderView` (affichage pur, présent dans la page pré-générée) et `SiteHeader`
 * qui lit l'adresse pour surligner la rubrique active. Le second se place sous <Suspense> avec le premier
 * comme repli : Next 16 ne connaît pas l'adresse des pages variables au moment de la génération.
 */
export function SiteHeader({ account }: { account?: ReactNode }) {
  return <SiteHeaderView account={account} pathname={usePathname()} />;
}

export function SiteHeaderView({ account, pathname = "" }: { account?: ReactNode; pathname?: string }) {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = dialogRef.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-forest focus:px-4 focus:py-2 focus:text-white"
      >
        Aller au contenu
      </a>
      <div className="mx-auto flex h-16 max-w-[75rem] items-center gap-3 px-4 sm:px-6 lg:h-20 lg:px-8">
        <Link
          href="/"
          className="flex min-h-12 shrink-0 items-center gap-2"
          aria-label={`${site.shortName} — accueil`}
        >
          <Image src={site.logos.symbol} alt="" width={40} height={40} className="lg:hidden" priority />
          <Image src={site.logos.seal} alt="" width={60} height={60} className="hidden lg:block" priority />
          <span className="font-display text-lg leading-tight font-semibold text-forest">ONG AFA</span>
        </Link>

        <nav aria-label="Navigation principale" className="ml-6 hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className={cn(
                    "inline-flex min-h-11 items-center rounded-full px-3 font-semibold text-ink-soft transition-colors hover:bg-sand hover:text-forest",
                    "aria-[current=page]:bg-sand aria-[current=page]:text-forest",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {account && <div className="hidden lg:block">{account}</div>}
          {links.search && (
            <Link
              href={links.search}
              className="grid size-12 place-items-center rounded-full text-forest hover:bg-sand"
              aria-label="Rechercher"
            >
              <Search className="size-5" aria-hidden="true" />
            </Link>
          )}
          <Button href={links.join} variant="accent" className="px-4 sm:px-6">
            <span>
              Rejoindre<span className="hidden sm:inline"> AFA</span>
            </span>
          </Button>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="grid size-12 place-items-center rounded-full text-forest hover:bg-sand lg:hidden"
            aria-label="Ouvrir le menu"
            aria-haspopup="dialog"
          >
            <Menu className="size-6" aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        onClose={() => setOpen(false)}
        aria-label="Menu"
        className="m-0 h-dvh max-h-none w-full max-w-none bg-white p-0 backdrop:bg-ink/40"
      >
        <div className="flex h-16 items-center justify-between border-b border-rule px-4">
          <span className="font-display text-lg font-semibold text-forest">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-12 place-items-center rounded-full text-forest hover:bg-sand"
            aria-label="Fermer le menu"
          >
            <X className="size-6" aria-hidden="true" />
          </button>
        </div>
        <nav aria-label="Navigation principale" className="px-4 py-6">
          <ul className="space-y-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="flex min-h-14 items-center rounded-card px-4 font-display text-h3 font-semibold text-forest hover:bg-sand aria-[current=page]:bg-sand"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-8 space-y-3">
            <Button
              href={links.producerSignup ?? links.join}
              variant="primary"
              className="w-full"
              onClick={() => setOpen(false)}
            >
              Je suis producteur / productrice
            </Button>
            {links.ask && (
              <Button href={links.ask} variant="secondary" className="w-full" onClick={() => setOpen(false)}>
                Poser une question à AFA
              </Button>
            )}
          </div>
        </nav>
      </dialog>
    </header>
  );
}
