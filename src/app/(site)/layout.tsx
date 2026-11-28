import { Suspense } from "react";
import { AfaChrome } from "@/components/afa/AfaChrome";
import { SearchPalette } from "@/components/search/SearchPalette";
import { MobileTabBar, MobileTabBarView } from "@/components/layout/MobileTabBar";
import { SiteFooter } from "@/components/layout/SiteFooter";

/**
 * Coquille commune des pages publiques. L'en-tête vit dans le premier panneau de chaque page
 * (ses couleurs suivent ce panneau) ; ici : lien d'évitement, pied de page, barre basse mobile
 * et habillage vivant (barre flottante, progression, retour en haut).
 * L'espace en bas est réservé à la barre de navigation mobile.
 *
 * Comptes mis de côté (site statique) : voir src/components/layout/AccountLink.tsx et docs/DEPLOIEMENT.md.
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom))] lg:pb-0">
      <a
        href="#contenu"
        className="sr-only z-[80] rounded-full bg-accent px-5 py-3 font-bold text-ink focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Aller au contenu
      </a>
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <Suspense fallback={<MobileTabBarView />}>
        <MobileTabBar />
      </Suspense>
      <Suspense fallback={null}>
        <AfaChrome />
      </Suspense>
      <SearchPalette />
    </div>
  );
}
