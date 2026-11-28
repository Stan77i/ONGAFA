import type { Metadata } from "next";
import Link from "next/link";
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
                    className="grid aspect-square place-items-center rounded-full border-[1.5px] border-ink shadow-[0_5px_0_#1d2417] transition-transform duration-[250ms] ease-(--ease-afa) hover:-translate-y-1 hover:rotate-0!"
                    style={{ background: tileBg[i], rotate: `${tileRot[i]}deg` }}
                  >
                    <AfaIcon name={domainIcon[d.slug]} size={54} className="h-auto w-[58%]" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </HeroPanel>

      <Panel tone="sand" label="Domaines d'intervention" className="py-[clamp(20px,3vw,48px)]">
        <ol className="flex flex-col">
          {domains.map((d, i) =>
            d.slug === "mais" ? (
              <li
                key={d.slug}
                id={d.slug}
                className="flex scroll-mt-24 flex-wrap-reverse items-center gap-4 border-b-[1.5px] border-rule py-[clamp(24px,3vw,40px)]"
              >
                <article className="afa-card sticker flex min-w-0 flex-[1_1_420px] flex-col bg-white p-2.5">
                  <div className="flex min-h-[220px] flex-col justify-between gap-5 rounded-[15px] rounded-br-none bg-harvest p-[clamp(20px,2.4vw,34px)]">
                    <span className="self-start rounded-full bg-ink px-3 py-1.5 text-[12px] font-extrabold tracking-[0.12em] text-sand uppercase">
                      Seconde culture
                    </span>
                    <p className="max-w-[44ch] text-[clamp(18px,1.5vw,22px)] leading-[1.45] font-semibold">
                      {d.text}
                    </p>
                  </div>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                    <h2 className="pt-[18px] pr-2 pb-2 pl-2.5 text-[clamp(48px,6vw,96px)] leading-[0.88] font-black tracking-[-0.05em]">
                      {d.title}
                    </h2>
                    <span
                      aria-hidden="true"
                      className="self-start rounded-b-[15px] bg-harvest px-[18px] pt-1 pb-3 font-ink text-[30px] leading-none"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                </article>
                <div className="relative z-[2] mx-auto -mb-6 max-w-[560px] min-w-0 flex-[1_1_320px]">
                  {/* eslint-disable-next-line @next/next/no-img-element -- export statique */}
                  <img
                    src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photos/mais-detoure.webp`}
                    width={945}
                    height={562}
                    alt="Épis de maïs, certains encore dans leurs feuilles"
                    className="-ml-[6%] block h-auto w-[112%] max-w-none drop-shadow-[0_18px_14px_rgba(29,36,23,.28)]"
                  />
                </div>
              </li>
            ) : (
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
                  <span
                    className="grid size-[clamp(52px,6vw,96px)] flex-none place-items-center overflow-visible rounded-full border-[1.5px] border-ink"
                    style={{ background: i === 0 ? "#efe6d2" : "#fff" }}
                  >
                    <AfaIcon name={domainIcon[d.slug]} size={52} className="h-auto w-[56%]" />
                  </span>
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
            ),
          )}
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
