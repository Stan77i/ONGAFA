import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { DeploymentBar } from "@/components/afa/dataviz";
import { Crumbs, CtaBand, Panel, SectionHead } from "@/components/afa/ui";
import { heroTones } from "@/components/layout/HeroPanel";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AfaMap } from "@/components/map/AfaMap";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Carte nationale",
  description:
    "Où l'ONG AFA est-elle présente en Côte d'Ivoire ? Implantée dans la région du N'Zi, AFA prépare son déploiement dans la Nawa puis sur l'ensemble du territoire.",
};

/**
 * Carte nationale : la carte immersive occupe tout le premier écran ; l'en-tête et le titre flottent
 * au-dessus (dégradé). Statuts : N'Zi implantée, Nawa prochaine étape, autres régions ensuite.
 * Fond de carte : geoBoundaries (CC BY 4.0), crédité dans la légende de la carte.
 */
export default function MapPage() {
  const t = heroTones.night;
  const vars = { "--hbg": t.bg, "--hfg": t.fg, "--hring": t.ring } as CSSProperties;
  return (
    <>
      <div className="panel-frame">
        <div
          style={vars}
          className="on-dark relative h-[calc(100svh-16px-5rem-env(safe-area-inset-bottom))] min-h-[600px] lg:h-[calc(100svh-24px)] overflow-hidden rounded-[22px] bg-night text-sand lg:min-h-[660px] sm:rounded-[28px]"
        >
          <AfaMap mode="full" className="absolute inset-0" />
          <div className="pointer-events-none absolute inset-x-0 top-0 z-[5] bg-[linear-gradient(rgba(20,26,16,.9),rgba(20,26,16,.55)_60%,rgba(20,26,16,0))] p-[clamp(12px,2vw,26px)]">
            <div className="pointer-events-auto">
              <SiteHeader current="/carte" join="orange" />
            </div>
            <div
              id="contenu"
              tabIndex={-1}
              className="map-title mt-[clamp(18px,3vw,40px)] flex max-w-[620px] flex-col gap-2.5 px-[clamp(6px,2vw,38px)] outline-none"
            >
              <div className="pointer-events-auto text-mint [&_a]:text-mint">
                <Crumbs items={[{ href: "/", label: "Accueil" }, { label: "Carte nationale" }]} />
              </div>
              <p className="text-[12px] font-extrabold tracking-[0.16em] text-sand uppercase">
                AFA {site.country} · Réseau national
              </p>
              <h1 className="ink-title text-[clamp(44px,6vw,104px)] leading-[0.92] text-sand">
                Le territoire AFA
              </h1>
              <p className="hand text-[clamp(26px,2.4vw,38px)] text-accent">
                On ne regarde pas la carte. On entre dans le territoire.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Panel id="chronologie" tone="sand" labelledBy="t-chronologie">
        <SectionHead
          id="t-chronologie"
          eyebrow="Chronologie"
          title="Les étapes du déploiement."
          intro="La carte s'enrichira à chaque nouvelle implantation."
        />
        <DeploymentBar className="mb-8 max-w-[640px]" />
        <ol className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
          <li className="afa-card sticker on-dark flex flex-col gap-3 bg-afa p-[26px] text-white">
            <span className="text-[13px] font-extrabold tracking-[0.1em] text-sand uppercase">
              <time dateTime={site.foundedOn}>{formatDate(site.foundedOn)}</time>
            </span>
            <span className="text-[clamp(24px,2.4vw,28px)] leading-[1.05] font-extrabold tracking-[-0.02em]">
              Création d&apos;AFA dans le N&apos;Zi
            </span>
            <span className="text-[16px] leading-normal text-sand">
              Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de
              sous-préfectures.
            </span>
          </li>
          <li className="afa-card flex flex-col gap-3 rounded-[22px] border-[1.5px] border-dashed border-ink bg-white p-[26px]">
            <span className="text-[13px] font-extrabold tracking-[0.1em] text-accent-text uppercase">
              Prochaine étape
            </span>
            <span className="text-[clamp(24px,2.4vw,28px)] leading-[1.05] font-extrabold tracking-[-0.02em]">
              Région de la Nawa
            </span>
            <span className="text-[16px] leading-normal text-ink-soft">
              Chef-lieu : Soubré. Première étape du déploiement national annoncé par AFA.
            </span>
          </li>
          <li className="afa-card flex flex-col gap-3 rounded-[22px] border-[1.5px] border-dashed border-ink bg-cream p-[26px]">
            <span className="text-[13px] font-extrabold tracking-[0.1em] text-accent-text uppercase">
              Ensuite
            </span>
            <span className="text-[clamp(24px,2.4vw,28px)] leading-[1.05] font-extrabold tracking-[-0.02em]">
              Les autres régions de Côte d&apos;Ivoire
            </span>
            <span className="text-[16px] leading-normal text-ink-soft">
              Un déploiement progressif sur l&apos;ensemble du territoire national.
            </span>
          </li>
        </ol>
      </Panel>

      <CtaBand
        id="t-cta-carte"
        title={<>AFA dans ma région&nbsp;?</>}
        note="Faisons-la pousser ensemble."
        href={links.join}
        label="Rejoindre le réseau"
      />
    </>
  );
}
