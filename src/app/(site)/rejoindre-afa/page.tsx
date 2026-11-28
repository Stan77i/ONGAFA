import type { Metadata } from "next";
import { Arrow } from "@/components/afa/icons";
import { Crumbs, Notebook, Panel, PillLink } from "@/components/afa/ui";
import { ProfilePicker } from "@/components/join/ProfilePicker";
import { HeroPanel } from "@/components/layout/HeroPanel";

export const metadata: Metadata = {
  title: "Rejoindre AFA",
  description:
    "Productrices, producteurs, coopératives, commerçantes, transformateurs, acheteurs, jeunes, partenaires : rejoignez le réseau de l'ONG AFA.",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * Version statique (site publié sur GitHub Pages) : présentation des profils, sans formulaire.
 * Le formulaire d'adhésion et l'inscription producteur sont prêts dans `_reporte/` (réactivation : docs/DEPLOIEMENT.md).
 */
export default function JoinPage() {
  return (
    <>
      <HeroPanel
        tone="orange"
        current="/rejoindre-afa"
        className="pb-0!"
        contentClassName="mt-[clamp(28px,4vw,56px)]"
      >
        <div className="grid items-end gap-[clamp(20px,3vw,48px)] lg:grid-cols-2">
          <div className="flex flex-col gap-[22px] lg:pb-[clamp(28px,4vw,56px)]">
            <Crumbs items={[{ href: "/", label: "Accueil" }, { label: "Rejoindre AFA" }]} />
            <h1 className="ink-title text-[clamp(64px,10vw,190px)] leading-[0.92]">Rejoindre AFA</h1>
            <p className="max-w-[50ch] text-[18px] leading-[1.55] font-medium sm:text-[19px]">
              AFA rassemble tous les acteurs de la filière manioc et du vivrier, du champ jusqu&apos;au
              marché.
            </p>
            <Notebook
              rotate={-4}
              margin={36}
              className="mt-1.5 py-3 pr-8 pl-[52px]"
              textClassName="text-[clamp(38px,4vw,58px)]"
            >
              Moi aussi, je suis AFA.
            </Notebook>
          </div>
          <div className="w-full max-w-[520px] justify-self-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- srcset fait main (export statique) */}
            <img
              src={`${BASE}/photos/femme-houe.webp`}
              srcSet={`${BASE}/photos/femme-houe-560.webp 560w, ${BASE}/photos/femme-houe.webp 900w`}
              sizes="(min-width: 1024px) 520px, 90vw"
              width={896}
              height={1200}
              alt="Une productrice souriante, casquette « Je suis AFA », houe sur l'épaule"
              fetchPriority="high"
              className="block h-auto w-full"
            />
          </div>
        </div>
      </HeroPanel>

      <Panel id="profils" tone="sand" labelledBy="t-profils">
        <div
          role="note"
          className="mb-[clamp(32px,4vw,56px)] flex flex-wrap items-center gap-4 rounded-[22px] border-[1.5px] border-dashed border-ink bg-white px-6 py-[18px]"
        >
          <span className="inline-flex items-center rounded-full bg-afa px-3.5 py-1.5 text-[13px] font-extrabold tracking-[0.06em] whitespace-nowrap text-white uppercase">
            Bientôt
          </span>
          <p className="flex-[1_1_320px] text-[17px] leading-normal">
            <strong className="font-extrabold">Inscriptions en ligne bientôt ouvertes.</strong>{" "}
            L&apos;inscription sera disponible prochainement sur cette page : environ deux minutes, depuis
            votre téléphone.
          </p>
        </div>
        <div className="mb-[clamp(28px,3.5vw,40px)] flex max-w-[820px] flex-col gap-3.5">
          <p className="eyebrow text-accent-text">01 — Qui peut rejoindre le réseau</p>
          <h2 id="t-profils" className="h-section">
            Vous êtes…
          </h2>
        </div>
        <ProfilePicker />
      </Panel>

      <Panel
        tone="cream"
        labelledBy="t-decouvrir"
        className="flex flex-wrap items-center justify-between gap-6 py-[clamp(28px,4vw,56px)]"
      >
        <h2
          id="t-decouvrir"
          className="max-w-[20ch] text-[clamp(28px,3.2vw,48px)] leading-none font-extrabold tracking-[-0.03em]"
        >
          En attendant, découvrez AFA.
        </h2>
        <div className="flex flex-wrap gap-3">
          <PillLink href="/a-propos" variant="ink" size="lg">
            Découvrir l&apos;ONG AFA <Arrow />
          </PillLink>
          <PillLink href="/actions" variant="outline" size="lg" className="border-2">
            Nos domaines d&apos;action <Arrow />
          </PillLink>
        </div>
      </Panel>
    </>
  );
}
