import type { Metadata } from "next";
import Image from "next/image";
import { AfaIconDark, Check } from "@/components/afa/icons";
import { AnchorPills, Crumbs, CtaBand, Declared, Notebook, Panel, SectionHead } from "@/components/afa/ui";
import { HeroPanel } from "@/components/layout/HeroPanel";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { ambitions, perspectives, president, purpose, results } from "@/content/afa";

export const metadata: Metadata = {
  title: "L'ONG AFA",
  description: `${site.name} : ONG ivoirienne créée en 2016, née dans la région du N'Zi, engagée pour l'autonomisation des femmes et la filière manioc.`,
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const resultIcons = ["field", "factory", "people"] as const;

export default function AboutPage() {
  return (
    <>
      <HeroPanel tone="orange" current="/a-propos">
        <div className="grid items-end gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
          <div className="flex flex-col gap-[22px]">
            <Crumbs items={[{ href: "/", label: "Accueil" }, { label: "L'ONG AFA" }]} />
            <h1 className="ink-title text-[clamp(72px,12vw,220px)]">L&apos;ONG AFA</h1>
            <p className="max-w-[24ch] text-[clamp(22px,2.2vw,32px)] leading-[1.15] font-extrabold tracking-[-0.015em]">
              {site.name}
            </p>
            <p className="max-w-[56ch] text-[17px] leading-[1.55] font-medium sm:text-[18px]">
              Une organisation non gouvernementale ivoirienne qui œuvre pour l&apos;autonomisation économique
              et sociale des femmes et des communautés rurales, avec la filière manioc comme axe prioritaire.
            </p>
            <AnchorPills
              items={[
                ["#histoire", "Histoire"],
                ["#objet", "Notre objet"],
                ["#realisations", "Réalisations"],
                ["#perspectives", "Perspectives"],
                ["#gouvernance", "Gouvernance"],
              ]}
            />
          </div>
          <div className="relative w-full max-w-[440px] justify-self-center max-lg:mt-4 max-lg:mr-3.5">
            <div className="relative aspect-[3/4]">
              <div className="absolute inset-0 translate-x-3.5 translate-y-3 rounded-[999px_999px_22px_22px] bg-afa" />
              {/* eslint-disable-next-line @next/next/no-img-element -- srcset fait main (export statique) */}
              <img
                src={`${BASE}/photos/femme-casquette.webp`}
                srcSet={`${BASE}/photos/femme-casquette-560.webp 560w, ${BASE}/photos/femme-casquette.webp 900w`}
                sizes="(min-width: 1024px) 440px, 90vw"
                width={900}
                height={1200}
                alt="Une productrice souriante portant la casquette « Je suis AFA »"
                className="absolute inset-0 block size-full rounded-[999px_999px_22px_22px] border-[2.5px] border-ink object-cover object-top"
              />
            </div>
            <div className="absolute bottom-9 -left-3 sm:-left-10">
              <Notebook
                rotate={-6}
                margin={32}
                className="py-2.5 pr-[26px] pl-[46px]"
                textClassName="text-[clamp(32px,3.2vw,44px)] whitespace-nowrap"
              >
                Née dans le N&apos;Zi, 2016
              </Notebook>
            </div>
          </div>
        </div>
      </HeroPanel>

      <Panel
        id="histoire"
        tone="sand"
        labelledBy="t-histoire"
        className="grid gap-[clamp(28px,4vw,64px)] lg:grid-cols-2"
      >
        <div className="flex flex-col gap-3.5">
          <p className="eyebrow text-accent-text">01 — Notre histoire</p>
          <h2 id="t-histoire" className="h-section">
            Née dans le N&apos;Zi en 2016.
          </h2>
          <div className="mt-2.5 flex max-w-[58ch] flex-col gap-4 text-[17px] leading-[1.6] sm:text-[18px]">
            <p>
              L&apos;ONG {site.name} ({site.shortName}) a été créée le 3 juin 2016 et reconnue sous le{" "}
              {site.registration}.
            </p>
            <p>
              Elle est née dans la région du N&apos;Zi, où elle a développé pendant une dizaine d&apos;années
              un modèle centré sur le manioc : plantations, unités de transformation et accompagnement des
              coopératives.
            </p>
            <p>
              Forte de ces résultats, AFA ambitionne aujourd&apos;hui de devenir un acteur de référence de la
              filière manioc en Côte d&apos;Ivoire et de se déployer sur l&apos;ensemble du territoire
              national.
            </p>
          </div>
        </div>
        <ol aria-label="Repères" className="relative flex flex-col self-center">
          {[
            {
              mark: <span className="text-[15px] font-extrabold text-white">2016</span>,
              ring: "bg-afa border-solid",
              title: "Création, le 3 juin",
              text: "Dans la région du N'Zi, zone de naissance d'AFA.",
            },
            {
              mark: <AfaIconDark name="sprout" size={30} />,
              ring: "bg-afa border-solid",
              title: "Une dizaine d'années dans le N'Zi",
              text: "Plantations, transformation, coopératives.",
            },
            {
              mark: <span className="text-[13px] font-extrabold">Nawa</span>,
              ring: "bg-white border-dashed",
              title: "Prochaine étape : la Nawa",
              text: "Chef-lieu : Soubré.",
            },
            {
              mark: <span className="text-[13px] font-extrabold">CI</span>,
              ring: "bg-cream border-dashed",
              title: "Puis toute la Côte d'Ivoire",
              hand: "pas à pas",
            },
          ].map((step, i, all) => (
            <li key={step.title} className="relative grid grid-cols-[64px_1fr] gap-5 pb-7 last:pb-0">
              {i < all.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute top-16 bottom-0 left-[31px] border-l-2 border-dashed border-ink/50"
                />
              )}
              <span
                className={`grid size-16 place-items-center rounded-full border-2 border-ink ${step.ring}`}
              >
                {step.mark}
              </span>
              <div className="flex flex-col gap-1 pt-2">
                <span className="text-[22px] leading-tight font-extrabold tracking-[-0.02em]">
                  {step.title}
                </span>
                {step.text && <span className="text-[16px] text-ink-soft">{step.text}</span>}
                {step.hand && <span className="hand text-[34px] text-pen">{step.hand}</span>}
              </div>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel id="objet" tone="cream" labelledBy="t-objet">
        <SectionHead
          id="t-objet"
          eyebrow="02 — Notre objet"
          title="Ce pour quoi AFA a été créée."
          intro={<p className="text-[16px]">Extrait de l&apos;objet de l&apos;association.</p>}
        />
        <ol className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {purpose.map((t, i) => (
            <li
              key={t}
              className={`afa-card sticker grid grid-cols-[auto_1fr] items-start gap-[18px] bg-white px-6 py-[22px] ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <span
                aria-hidden="true"
                className="min-w-11 font-ink text-[40px] leading-none text-accent-deep"
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="text-[17px] leading-normal">{t}</span>
            </li>
          ))}
        </ol>
      </Panel>

      <Panel id="realisations" tone="forest" labelledBy="t-realisations">
        <SectionHead
          id="t-realisations"
          tone="forest"
          eyebrow="03 — Nos réalisations"
          title="Le bilan d'AFA dans le N'Zi."
          intro="Résultats obtenus après une dizaine d'années d'activité, tels que déclarés par l'ONG."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4">
          {results.items.map((r, i) => (
            <div
              key={r.label}
              className="afa-card flex flex-col gap-2.5 rounded-[22px] border-[1.5px] border-sand/30 p-7"
            >
              <AfaIconDark name={resultIcons[i]} />
              <p
                className={
                  i === 0
                    ? "font-ink text-[clamp(46px,4.6vw,72px)] leading-[1.05] text-accent"
                    : "font-ink text-[clamp(36px,3.6vw,56px)] leading-[1.05] text-accent"
                }
                {...(i === 0 ? { "data-count": "4000", "data-unit": "ha" } : {})}
              >
                {r.value}
              </p>
              <p className="text-[18px]">{r.label}</p>
            </div>
          ))}
        </div>
        <Declared className="mt-5 text-mint" />
      </Panel>

      <Panel id="perspectives" tone="sand" labelledBy="t-perspectives">
        <SectionHead
          id="t-perspectives"
          eyebrow="04 — Nos perspectives"
          maxWidth="880px"
          title="Structurer toute la filière manioc."
          intro="Après le N'Zi, AFA prévoit de se déployer dans la Nawa puis progressivement dans les autres régions, en travaillant sur toute la chaîne de valeur avec les structures d'encadrement du secteur."
        />
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="afa-card sticker flex flex-col gap-[18px] bg-white p-[clamp(22px,2.5vw,36px)]">
            <h3 className="text-[clamp(22px,2.2vw,26px)] font-extrabold tracking-[-0.02em]">
              Pour y parvenir, AFA prévoit de :
            </h3>
            <ul className="flex flex-col gap-3.5">
              {perspectives.map((t) => (
                <li key={t} className="grid grid-cols-[28px_1fr] gap-3 text-[17px] leading-normal">
                  <Check />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="afa-card sticker on-dark flex flex-col gap-[18px] bg-afa p-[clamp(22px,2.5vw,36px)] text-white">
            <h3 className="text-[clamp(22px,2.2vw,26px)] font-extrabold tracking-[-0.02em]">
              À terme, AFA vise à :
            </h3>
            <ul className="flex flex-col gap-3.5">
              {ambitions.map((t) => (
                <li key={t} className="grid grid-cols-[28px_1fr] gap-3 text-[17px] leading-normal">
                  <Check bg="#f7f2e8" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      <Panel
        id="gouvernance"
        tone="cream"
        labelledBy="t-gouvernance"
        className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2"
      >
        <div className="flex flex-col gap-3.5">
          <p className="eyebrow text-accent-text">05 — Gouvernance</p>
          <h2 id="t-gouvernance" className="h-section">
            La présidence de l&apos;ONG.
          </h2>
        </div>
        <figure className="afa-card sticker flex flex-wrap items-center gap-6 bg-white p-7">
          {president.photo ? (
            <Image
              src={president.photo}
              alt={`${president.title} ${president.name}`}
              width={120}
              height={120}
              className="size-[120px] flex-none rounded-full border-2 border-ink object-cover"
            />
          ) : (
            <div
              role="img"
              aria-label="Photo à venir"
              className="grid size-[120px] flex-none place-items-center rounded-full border-2 border-ink bg-accent font-ink text-[44px] text-ink"
            >
              É
            </div>
          )}
          <figcaption className="flex min-w-0 flex-[1_1_220px] flex-col gap-1.5">
            <span className="eyebrow text-accent-text">{president.role}</span>
            <span className="text-[clamp(24px,2.2vw,32px)] leading-[1.1] font-extrabold tracking-[-0.02em]">
              {president.title} {president.name}
            </span>
          </figcaption>
        </figure>
      </Panel>

      <CtaBand
        id="t-cta-ong"
        title={<>Vous souhaitez travailler avec AFA&nbsp;?</>}
        href={links.join}
        label="Rejoindre le réseau"
      />
    </>
  );
}
