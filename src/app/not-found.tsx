import type { Metadata } from "next";
import { Arrow } from "@/components/afa/icons";
import { Notebook, PillLink } from "@/components/afa/ui";

export const metadata: Metadata = { title: "Page introuvable" };

/** Page 404, montée en permanence par Next : aucune image (sinon préchargée sur chaque page). */
export default function NotFound() {
  return (
    <main className="panel-frame flex flex-1 flex-col">
      <div className="on-orange flex flex-1 flex-col items-start justify-center gap-6 rounded-[22px] bg-accent px-[clamp(20px,6vw,96px)] py-16 text-ink sm:rounded-[28px]">
        <p className="eyebrow">Erreur 404</p>
        <h1 className="ink-title text-[clamp(64px,10vw,180px)]">Perdu&nbsp;?</h1>
        <p className="max-w-[48ch] text-[18px] leading-normal font-medium">
          Cette page n&apos;existe pas : le lien est peut-être ancien ou la page a été déplacée. Retrouvez
          l&apos;essentiel depuis l&apos;accueil.
        </p>
        <Notebook rotate={-3} margin={36} className="py-2 pr-7 pl-12" textClassName="text-[38px]">
          On retourne au champ ?
        </Notebook>
        <PillLink href="/" variant="ink" size="xl" className="mt-2">
          Retour à l&apos;accueil <Arrow />
        </PillLink>
      </div>
    </main>
  );
}
