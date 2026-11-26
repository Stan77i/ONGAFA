import { Suspense } from "react";
import { MobileTabBar, MobileTabBarView } from "@/components/layout/MobileTabBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader, SiteHeaderView } from "@/components/layout/SiteHeader";

/**
 * Coquille commune des pages publiques. L'espace en bas est réservé à la barre de navigation mobile.
 * En-tête et barre mobile : la version « pure » est dans la page pré-générée ; la rubrique active
 * (qui dépend de l'adresse) se met à jour juste après, sans décalage visuel.
 *
 * Comptes mis de côté (site statique) : pour les réactiver, repasser `account={<AccountLink />}` sous
 * <Suspense> à SiteHeader (voir src/components/layout/AccountLink.tsx et docs/DEPLOIEMENT.md).
 */
export default function SiteLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-full flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-0">
      <Suspense fallback={<SiteHeaderView />}>
        <SiteHeader />
      </Suspense>
      <main id="contenu" className="flex-1">
        {children}
      </main>
      <SiteFooter />
      <Suspense fallback={<MobileTabBarView />}>
        <MobileTabBar />
      </Suspense>
    </div>
  );
}
