import type { Metadata } from "next";
import Link from "next/link";
import { DomainArt, DomainMedallion, hasDomainPhoto } from "@/components/afa/DomainMedallion";
import { domainIcon } from "@/components/afa/domains";
import { AfaIcon, Arrow } from "@/components/afa/icons";
import { Crumbs, CtaBand, Panel, SectionHead } from "@/components/afa/ui";
import { HeroPanel } from "@/components/layout/HeroPanel";
import { links } from "@/config/navigation";
import { domains, perspectives } from "@/content/afa";

export const metadata: Metadata = {
  title: "Nos actions",
  description:
    "Filière manioc, maïs, transformation agroalimentaire, femmes et revenus, jeunes et formation, coopératives, commercialisation et développement local : les domaines d'intervention de l'ONG AFA.",
};

const tileRot = [-6, 4, -3, 7, 5, -7, 3, -4];
const tileBg = ["#4a7230", "#f7f2e8", "#efe6d2", "#f7f2e8", "#efe6d2", "#f7f2e8", "#efe6d2", "#f7f2e8"];

export default function ActionsPage() {
  return (
    <>
      <HeroPanel tone="orange" current="/actions">
        <div className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
          <div className="flex flex-col gap-[22px]">
            <Crumbs items={[{ href: "/", label: "Accueil" }, { label: "Nos actions" }]} />
            <h1 className="ink-title text-[clamp(72px,11vw,210px)]">Nos actions</h1>
            <p className="text-[clamp(22px,2.2vw,32px)] leading-[1.15] font-extrabold tracking-[-0.015em]">
              Nos domaines d&apos;intervention
            </p>
            <p className="max-w-[56ch] text-[17px] leading-[1.55] font-medium sm:text-[18px]">
              Le manioc est l&apos;axe prioritaire d&apos;AFA. Autour de lui, l&apos;ONG agit sur la
              production, la transformation, la formation, l&apos;organisation des producteurs et l&apos;accès
              aux marchés.
            </p>
          </div>
          <nav aria-label="Aller à un domaine" className="w-full max-w-[520px] justify-self-center">
            <ul className="grid grid-cols-4 gap-[clamp(10px,1.4vw,20px)]">
              {domains.map((d, i) => (
                <li key={d.slug}>
                  <a
                    href={`#${d.slug}`}
                    aria-label={d.title}
                    title={d.title}
                    className="relative grid aspect-square place-items-center rounded-full border-[1.5px] border-ink shadow-[0_5px_0_#1d2417] transition-transform duration-[250ms] ease-(--ease-afa) hover:-translate-y-1 hover:rotate-0!"
                    style={{ background: tileBg[i], rotate: `${tileRot[i]}deg` }}
                  >
                    {hasDomainPhoto(d.slug) ? (
                      <DomainArt slug={d.slug} />
                    ) : (
                      <AfaIcon name={domainIcon[d.slug]} size={54} className="h-auto w-[58%]" />
                    )}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </HeroPanel>

      <Panel tone="sand" label="Domaines d'intervention" className="py-[clamp(20px,3vw,48px)]">
        <ol className="flex flex-col">
          {domains.map((d, i) => (
            <li
              key={d.slug}
              id={d.slug}
              className="grid scroll-mt-24 grid-cols-[repeat(auto-fit,minmax(min(100%,320px),1fr))] items-center gap-[clamp(16px,3vw,48px)] border-b-[1.5px] border-rule py-[clamp(24px,3vw,40px)]"
            >
              <div className="flex items-center gap-[clamp(14px,2vw,28px)]">
                <span
                  aria-hidden="true"
                  className="min-w-[1.3em] font-ink sm:min-w-[1.6em] text-[clamp(36px,4vw,64px)] leading-none text-accent-deep"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <DomainMedallion slug={d.slug} bg={i === 0 ? "#efe6d2" : "#fff"} />
                <h2 className="min-w-0 text-[clamp(22px,2.6vw,40px)] leading-[1.05] font-extrabold tracking-[-0.025em] hyphens-auto [overflow-wrap:break-word]">
                  {d.title}
                </h2>
              </div>
              <div className="flex flex-col items-start gap-3">
                <p className="max-w-[56ch] text-[17px] leading-[1.55] text-ink-soft sm:text-[18px]">
                  {d.text}
                </p>
                {"href" in d && (
                  <Link
                    href={d.href}
                    data-magnetic=""
                    className="inline-flex min-h-12 items-center gap-2.5 rounded-full border-[1.5px] border-ink bg-afa px-[22px] text-[15px] font-extrabold whitespace-nowrap text-white hover:bg-forest"
                  >
                    Explorer l&apos;espace manioc <Arrow />
                  </Link>
                )}
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel tone="forest" labelledBy="t-prepare">
        <SectionHead
          id="t-prepare"
          tone="forest"
          eyebrow="Prochaines étapes"
          title="Ce qu'AFA prépare."
          intro="Les chantiers annoncés par l'ONG pour accompagner son déploiement national."
        />
        <ol className="grid gap-4 lg:grid-cols-2">
          {perspectives.map((t, i) => (
            <li
              key={t}
              className="afa-card sticker grid grid-cols-[auto_1fr] items-start gap-5 bg-sand px-[26px] py-6 text-ink"
            >
              <span aria-hidden="true" className="font-ink text-[44px] leading-none text-accent-deep">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[17px] leading-normal sm:text-[18px]">{t}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <CtaBand
        id="t-cta-actions"
        title="Agir avec AFA."
        note="Et vous, que cultivez-vous ?"
        href={links.join}
        label="Rejoindre le réseau"
      />
    </>
  );
}
