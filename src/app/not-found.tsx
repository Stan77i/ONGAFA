import type { Metadata } from "next";
import { Button } from "@/components/ui/Button";
import { site } from "@/config/site";

export const metadata: Metadata = { title: "Page introuvable" };

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-xl flex-1 flex-col items-center justify-center gap-6 px-4 py-16 text-center">
      {/* eslint-disable-next-line @next/next/no-img-element -- image locale, export statique */}
      <img src={site.logos.symbol} alt="" width={72} height={72} />
      <h1 className="font-display text-3xl font-semibold text-forest">Cette page n&apos;existe pas</h1>
      <p className="text-ink-soft">
        Le lien est peut-être ancien ou la page a été déplacée. Retrouvez l&apos;essentiel depuis
        l&apos;accueil.
      </p>
      <Button href="/">Retour à l&apos;accueil</Button>
    </main>
  );
}
