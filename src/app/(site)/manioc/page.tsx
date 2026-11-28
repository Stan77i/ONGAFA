import type { Metadata } from "next";
import { AfaIcon, type AfaIconName } from "@/components/afa/icons";
import { PhotoStory, type StorySpot } from "@/components/afa/PhotoStory";
import { AnchorPills, Crumbs, CtaBand, Declared, Notebook, Panel, SectionHead } from "@/components/afa/ui";
import { UsesRing } from "@/components/afa/dataviz";
import { ValueChain } from "@/components/brand/ValueChain";
import { HeroPanel } from "@/components/layout/HeroPanel";
import { links } from "@/config/navigation";
import { cassava, results } from "@/content/afa";

export const metadata: Metadata = {
  title: "Le manioc en Côte d'Ivoire",
  description:
    "Manioc doux et manioc amer, variétés cultivées en Côte d'Ivoire (Yavo, Bocou, Olekanga, Bonoua…), attiéké, placali, gari et dérivés alimentaires, pharmaceutiques et cosmétiques.",
};

const groupIcons: Record<string, AfaIconName> = {
  Alimentation: "alimentation",
  Pharmacie: "pharmacie",
  Cosmétique: "cosmetique",
  "Toute la plante": "plante",
};

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const usesTotal = cassava.derivatives.reduce((n, g) => n + g.items.length, 0);
const attieke = cassava.dishes.find((d) => d.name === "Attiéké");

/** Fils de la photo : contenus de l'espace manioc (src/content/afa.ts). */
const heroSpots: StorySpot[] = [
  {
    x: 43,
    y: 50,
    lx: -8,
    ly: 70,
    bend: -40,
    tag: "Culture",
    t: "Le maïs aussi",
    d: "Seconde culture de l'objet d'AFA, de la production à la transformation en produits finis.",
  },
  {
    x: 82,
    y: 44,
    lx: 62,
    ly: 64,
    bend: 40,
    tag: "Transformation",
    t: `${usesTotal} usages`,
    d: "Alimentation, pharmacie, cosmétique : chaque partie de la plante peut être valorisée.",
  },
  {
    x: 42,
    y: 14,
    lx: 20,
    ly: 32,
    bend: -20,
    tag: "Dans l'assiette",
    t: "L'attiéké",
    d: attieke?.text ?? "",
  },
  {
    x: 70,
    y: 50,
    lx: 34,
    ly: 86,
    bend: 20,
    tag: "Sécurité alimentaire",
    t: "Manioc amer",
    d: "Jamais consommé sans traitement : râpage, fermentation, pressage, séchage ou cuisson prolongée éliminent ses composés toxiques.",
  },
];

export default function CassavaPage() {
  return (
    <>
      <HeroPanel tone="green" current="/manioc" contentClassName="mt-[clamp(28px,4vw,56px)]">
        <div className="grid items-end gap-[clamp(20px,3vw,48px)] lg:grid-cols-2">
          <div className="flex flex-col gap-[22px] pb-[clamp(8px,4vw,56px)]">
            <Crumbs items={[{ href: "/", label: "Accueil" }, { label: "Espace manioc" }]} />
            <h1 className="ink-title relative z-[3] text-[clamp(64px,13vw,236px)] leading-[0.88] text-sand">
              Le manioc
            </h1>
            <p className="text-[clamp(22px,2.2vw,32px)] leading-[1.15] font-extrabold tracking-[-0.015em] text-white">
              en Côte d&apos;Ivoire
            </p>
            <p className="max-w-[54ch] text-[17px] leading-[1.55] font-medium sm:text-[18px]">
              Culture vivrière majeure du pays et axe prioritaire d&apos;AFA. De la variété plantée aux
              dizaines de produits qui en sont tirés, tout ce qu&apos;il faut savoir sur le manioc.
            </p>
            <AnchorPills
              light
              items={[
                ["#chaine", "Chaîne de valeur"],
                ["#categories", "Doux ou amer"],
                ["#varietes", "Variétés"],
                ["#usages", "Plats"],
                ["#derives", "Dérivés"],
              ]}
            />
          </div>
          <div className="relative w-full max-w-[620px] self-end justify-self-center">
            <PhotoStory spots={heroSpots} ink="#f7f2e8" lit="#df8433">
              {/* eslint-disable-next-line @next/next/no-img-element -- srcset fait main (export statique) */}
              <img
                src={`${BASE}/photos/femmes-groupe.webp`}
                srcSet={`${BASE}/photos/femmes-groupe-560.webp 560w, ${BASE}/photos/femmes-groupe.webp 1100w`}
                sizes="(min-width: 1024px) 44vw, 92vw"
                width={1100}
                height={978}
                alt="Des productrices tenant maïs et manioc"
                className="block h-auto w-full"
              />
            </PhotoStory>
            <div className="absolute top-[4%] right-[2%]">
              <Notebook
                rotate={5}
                margin={30}
                className="py-2.5 pr-6 pl-11"
                textClassName="text-[clamp(30px,3vw,40px)] whitespace-nowrap"
              >
                attiéké, placali, gari…
              </Notebook>
            </div>
          </div>
        </div>
      </HeroPanel>

      <Panel id="chaine" tone="forest" labelledBy="t-chaine">
        <SectionHead
          id="t-chaine"
          tone="forest"
          eyebrow="01 — Chaîne de valeur"
          title="Du champ à l'autonomie des producteurs."
          intro="AFA veut agir à chaque étape, pour que la valeur créée par le manioc profite d'abord à celles et ceux qui le cultivent."
        />
        <ValueChain variant="dark" />
        <div className="mt-[clamp(36px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,280px),1fr))] gap-4 border-t-[1.5px] border-sand/20 pt-[clamp(28px,3vw,40px)]">
          {results.items.map((r, i) => (
            <div key={r.label} className="flex flex-col gap-1.5">
              <p
                className={
                  i === 0
                    ? "font-ink text-[clamp(40px,3.8vw,60px)] leading-[1.05] text-accent"
                    : "font-ink text-[clamp(32px,3vw,48px)] leading-[1.05] text-accent"
                }
                {...(i === 0 ? { "data-count": "4000", "data-unit": "ha" } : {})}
              >
                {r.value}
              </p>
              <p className="text-[17px]">{r.label}</p>
            </div>
          ))}
        </div>
        <Declared className="mt-[18px] text-mint" />
      </Panel>

      <Panel id="categories" tone="sand" labelledBy="t-categories">
        <SectionHead
          id="t-categories"
          eyebrow="02 — Bien le connaître"
          maxWidth="880px"
          title={
            <>
              Doux <span className="hand text-[1.1em] text-pen">ou</span> amer.
            </>
          }
          intro="En Côte d'Ivoire, le manioc se répartit en deux grandes catégories, auxquelles s'ajoutent des variétés locales traditionnelles et des variétés améliorées diffusées par la recherche agronomique."
        />
        <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,400px),1fr))] gap-4">
          {cassava.categories.map((c, i) => (
            <article
              key={c.name}
              className="afa-card sticker flex flex-col gap-3.5 bg-white p-[clamp(22px,2.5vw,36px)]"
            >
              <div className="flex items-center gap-3.5">
                <AfaIcon name={i === 0 ? "doux" : "amer"} size={52} data-card-icon="" />
                <h3 className="text-[clamp(24px,2.4vw,30px)] font-extrabold tracking-[-0.02em]">{c.name}</h3>
              </div>
              <p className="text-[17px] leading-[1.55] text-ink-soft">{c.text}</p>
            </article>
          ))}
        </div>
        <div
          role="note"
          className="mt-4 flex items-start gap-4 rounded-[22px] border-[1.5px] border-ink bg-accent px-6 py-5"
        >
          <AfaIcon name="warn" size={34} />
          <p className="text-[17px] leading-normal">
            <strong className="font-extrabold">Sécurité alimentaire.</strong> Le manioc amer ne doit jamais
            être consommé sans traitement : râpage, fermentation, pressage, séchage ou cuisson prolongée
            éliminent ses composés toxiques.
          </p>
        </div>
      </Panel>

      <Panel id="varietes" tone="cream" labelledBy="t-varietes">
        <SectionHead
          id="t-varietes"
          eyebrow="03 — Variétés"
          maxWidth="760px"
          title="Les variétés cultivées en Côte d'Ivoire."
          action={
            <p className="max-w-[36ch] text-[14px] text-ink-soft">
              Rendements volontairement absents tant qu&apos;ils ne sont pas sourcés (CNRA).
            </p>
          }
        />
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-4">
          {cassava.varieties.map((v, i) => (
            <li key={v.name} className="afa-card sticker flex flex-col gap-2.5 bg-white px-6 py-[22px]">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[24px] leading-tight font-extrabold tracking-[-0.02em]">{v.name}</span>
                <span className="font-ink text-[22px] text-accent-text" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[16px] leading-normal text-ink-soft">{v.text}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel id="usages" tone="orange" labelledBy="t-usages">
        <div className="mb-[clamp(28px,3.5vw,48px)] flex max-w-[820px] flex-col gap-3.5">
          <p className="eyebrow">04 — Dans l&apos;assiette</p>
          <h2 id="t-usages" className="ink-title text-[clamp(56px,7vw,120px)] leading-[0.95]">
            Bon appétit.
          </h2>
          <p className="text-[clamp(22px,2vw,30px)] font-extrabold tracking-[-0.015em]">
            Les grands plats à base de manioc.
          </p>
        </div>
        <ul className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,250px),1fr))] gap-4">
          {cassava.dishes.map((d) => (
            <li key={d.name} className="afa-card sticker flex flex-col gap-2.5 bg-sand p-6">
              <span className="text-[28px] font-extrabold tracking-[-0.02em]">{d.name}</span>
              <span className="text-[16px] leading-normal text-ink-soft">{d.text}</span>
            </li>
          ))}
        </ul>
      </Panel>

      <Panel id="derives" tone="sand" labelledBy="t-derives">
        <SectionHead
          id="t-derives"
          eyebrow="05 — Transformation"
          maxWidth="880px"
          title="Une plante, des dizaines de produits."
          intro="Le manioc ne nourrit pas seulement : son amidon entre dans des médicaments et des cosmétiques, et chaque partie de la plante peut être valorisée."
        />
        <div className="mb-8">
          <UsesRing groups={cassava.derivatives.map((g) => ({ group: g.group, count: g.items.length }))} />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          {cassava.derivatives.map((g) => (
            <article
              key={g.group}
              className="afa-card sticker flex flex-col gap-4 bg-white p-[clamp(22px,2.5vw,32px)]"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-16 flex-none place-items-center rounded-full border-[1.5px] border-ink bg-cream">
                  <AfaIcon name={groupIcons[g.group]} size={36} />
                </span>
                <div className="flex flex-col gap-0.5">
                  <span className="eyebrow text-accent-text">
                    {g.items.length} {g.group === "Toute la plante" ? "usages" : "dérivés"}
                  </span>
                  <h3 className="text-[28px] font-extrabold tracking-[-0.02em]">{g.group}</h3>
                </div>
              </div>
              {"intro" in g && g.intro && <p className="text-[15px] text-ink-soft">{g.intro}</p>}
              <ul className="flex flex-wrap gap-2">
                {g.items.map((it) => (
                  <li
                    key={it}
                    className="rounded-2xl border-[1.5px] border-rule bg-sand px-3.5 py-2 text-[14px] leading-[1.3] font-semibold"
                  >
                    {it}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </Panel>

      <CtaBand
        id="t-cta-manioc"
        tone="forest"
        title={<>Vous produisez ou transformez du manioc&nbsp;?</>}
        note="Rejoignez le réseau AFA."
        href={links.join}
        label="Rejoindre AFA"
      />
    </>
  );
}
