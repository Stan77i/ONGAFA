import Link from "next/link";
import { DeploymentBar } from "@/components/afa/dataviz";
import { domainIcon } from "@/components/afa/domains";
import { AfaIcon, Arrow } from "@/components/afa/icons";
import { Declared, Notebook, Panel, PillLink, SectionHead } from "@/components/afa/ui";
import { ValueChain } from "@/components/brand/ValueChain";
import { NewsListItem } from "@/components/content/NewsListItem";
import { HeroJeSuisAfa } from "@/components/home/HeroJeSuisAfa";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { AfaMap } from "@/components/map/AfaMap";
import { links } from "@/config/navigation";
import { site } from "@/config/site";
import { cassava, domains, results } from "@/content/afa";
import { getRecentNews } from "@/lib/content/data";

/** Aperçu de chaque famille de dérivés (extraits de cassava.derivatives). */
const derivativePreview: Record<string, string> = {
  Alimentation: "Attiéké · Placali · Gari · Tapioca…",
  Pharmacie: "Excipients · Liants · Supports pour gélules…",
  Cosmétique: "Poudres matifiantes · Savons · Crèmes…",
  "Toute la plante": "Feuilles · Épluchures · Tiges (boutures)",
};

const joinProfiles = [
  "Je suis productrice ou producteur",
  "Nous sommes une coopérative",
  "Je suis commerçante",
  "Je veux soutenir AFA",
];

/**
 * Accueil. La veille du vivrier n'apparaît que si des informations sont publiées.
 * Chiffres : bilan déclaré par l'ONG, toujours accompagné de sa période et de sa source.
 */
export default async function HomePage() {
  const news = await getRecentNews(4);
  const [featured, ...others] = domains;
  const ha = results.items[0];

  return (
    <>
      <HeroJeSuisAfa header={<SiteHeader variant="home" current="/" />} />

      {/* 02 — Devise */}
      <Panel id="histoire" tone="sand" label="Notre devise" bare className="overflow-hidden">
        <div className="flex flex-wrap items-center gap-[clamp(20px,3vw,48px)] px-[clamp(20px,4vw,64px)] pt-[clamp(24px,4vw,64px)] pb-[clamp(20px,3vw,40px)]">
          <div className="flex max-w-[300px] flex-[1_1_230px] flex-col justify-between gap-[18px] self-stretch">
            <div className="flex items-start gap-2.5">
              <svg
                width="30"
                height="30"
                viewBox="0 0 30 30"
                aria-hidden="true"
                className="-mt-1.5 flex-none"
              >
                <path
                  d="M15 2 V9 M4 8 L10 13 M26 8 L20 13 M2 20 H9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="flex flex-col gap-2">
                <p className="text-[16px] leading-normal">
                  Depuis le 3 juin 2016, l&apos;ONG {site.name} structure la filière manioc, de la plantation
                  à la transformation.
                </p>
                <Link
                  href="/a-propos#histoire"
                  className="flex min-h-11 items-center gap-2 text-[13px] font-extrabold tracking-[0.04em] text-forest uppercase hover:underline"
                >
                  Lire notre histoire <Arrow />
                </Link>
              </div>
            </div>
            <div className="flex flex-col items-start gap-1">
              <svg
                width="200"
                height="150"
                viewBox="0 0 200 150"
                aria-hidden="true"
                className="ml-[30px] hidden sm:block"
              >
                <path
                  d="M18 144 C30 110 22 70 52 72 C86 74 66 128 44 114 C20 98 62 42 104 54 C136 63 124 100 102 94 C80 88 120 30 186 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M170 10 L188 17 L176 32"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <PillLink href={links.join} variant="outline" size="md">
                Rejoindre le réseau
              </PillLink>
            </div>
          </div>

          <div className="flex min-w-0 flex-[2_1_380px] justify-center">
            <div className="relative aspect-[936/1000] w-full max-w-[600px]">
              {/* eslint-disable-next-line @next/next/no-img-element -- srcset fait main (export statique) */}
              <img
                src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photos/afrique-femmes.webp`}
                srcSet={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photos/afrique-femmes-560.webp 560w, ${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/photos/afrique-femmes.webp 936w`}
                sizes="(min-width: 1100px) 40vw, 90vw"
                alt="Des productrices tenant manioc et maïs, dans la carte de l'Afrique du logo AFA"
                width={936}
                height={1000}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 block size-full"
              />
            </div>
          </div>

          <div className="flex min-w-0 flex-[1.6_1_340px] flex-col gap-5">
            <p className="eyebrow text-accent-text">Notre devise</p>
            <h2 className="m-0 text-[clamp(40px,5.4vw,88px)] leading-[0.94] font-extrabold tracking-[-0.035em]">
              {site.slogan}.
            </h2>
            <p className="self-end text-[14px] font-semibold text-ink-soft">
              Région du N&apos;Zi · {site.country}
            </p>
          </div>
        </div>

        <div className="mx-[clamp(20px,4vw,64px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,260px),1fr))] gap-7 border-t-[1.5px] border-ink pt-[clamp(24px,3vw,40px)] pb-[clamp(28px,3vw,44px)]">
          {results.items.map((r, i) => (
            <div key={r.label} className="flex flex-col gap-1.5">
              <p
                className="text-[clamp(30px,3vw,48px)] leading-none font-extrabold tracking-[-0.03em]"
                {...(i === 0 ? { "data-count": "4000", "data-unit": "ha" } : {})}
              >
                {r.value}
              </p>
              <p className="max-w-[30ch] text-[16px] text-ink-soft">{r.label}</p>
            </div>
          ))}
          <Declared className="col-span-full text-ink-soft" />
        </div>
      </Panel>

      {/* 03 — Domaines */}
      <Panel tone="cream" labelledBy="t-domaines">
        <SectionHead
          id="t-domaines"
          tone="cream"
          eyebrow="03 — Ce que fait AFA"
          title="Le manioc d'abord. Et tout ce qui permet d'en vivre."
          maxWidth="760px"
          action={
            <PillLink href="/actions" variant="outline" size="md">
              Toutes nos actions <Arrow />
            </PillLink>
          }
        />
        <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <li className="md:col-span-2">
            <Link
              href={featured.slug === "manioc" ? "/manioc" : "/actions"}
              className="afa-card sticker group grid h-full grid-cols-[repeat(auto-fit,minmax(min(100%,340px),1fr))] gap-[clamp(20px,3vw,48px)] bg-forest p-[clamp(24px,3vw,40px)] text-sand"
            >
              <div className="flex flex-col gap-4">
                <span data-card-icon="" className="grid size-[72px] place-items-center rounded-full bg-sand">
                  <AfaIcon name="manioc" size={46} />
                </span>
                <p className="eyebrow text-mint">Axe prioritaire</p>
                <h3 className="m-0 text-[clamp(30px,3vw,44px)] leading-none font-extrabold tracking-[-0.025em]">
                  {featured.title}
                </h3>
                <p className="max-w-[46ch] text-[17px] leading-[1.55]">{featured.text}</p>
                <span className="mt-auto inline-flex items-center gap-2.5 text-[14px] font-extrabold tracking-[0.06em] text-mint uppercase group-hover:underline">
                  Explorer l&apos;espace manioc <Arrow color="#a9c98f" />
                </span>
              </div>
              <div className="flex flex-col justify-between gap-6 border-sand/25 sm:border-l-[1.5px] sm:pl-[clamp(0px,3vw,40px)]">
                <div className="flex flex-col gap-1.5">
                  <p
                    className="font-ink text-[clamp(56px,7vw,112px)] leading-none text-accent"
                    data-count="4000"
                    data-unit="ha"
                  >
                    {ha.value}
                  </p>
                  <p className="text-[18px]">{ha.label}</p>
                  <Declared className="text-mint" />
                </div>
                <ul aria-label="Chaîne de valeur" className="flex flex-wrap gap-2">
                  {[
                    "Production",
                    "Collecte",
                    "Transformation",
                    "Valorisation",
                    "Commercialisation",
                    "Débouchés",
                  ].map((step) => (
                    <li
                      key={step}
                      className="rounded-full border-[1.5px] border-sand/45 px-3.5 py-[7px] text-[13px] font-bold"
                    >
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </Link>
          </li>
          {others.map((d, i) => (
            <li key={d.slug} className={i === others.length - 1 ? "md:col-span-2 lg:col-span-1" : undefined}>
              <div className="afa-card sticker flex h-full flex-col gap-3 bg-white p-6">
                <AfaIcon name={domainIcon[d.slug]} size={56} data-card-icon="" />
                <h3 className="mt-2 text-[23px] leading-[1.1] font-extrabold tracking-[-0.02em]">
                  {d.title}
                </h3>
                <p className="text-[16px] leading-normal text-ink-soft">{d.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      {/* 04 — Chaîne de valeur */}
      <Panel tone="forest" labelledBy="t-chaine" className="overflow-hidden">
        <SectionHead
          id="t-chaine"
          tone="forest"
          eyebrow="04 — Filière manioc"
          title={
            <>
              Du champ aux produits finis,{" "}
              <span className="hand text-[1.15em] text-accent">un seul fil.</span>
            </>
          }
          intro="AFA veut agir sur toute la chaîne de valeur du manioc, pour que la valeur créée profite d'abord aux productrices et aux producteurs."
        />
        <ValueChain variant="dark" />
        <ul className="mt-[clamp(36px,4vw,56px)] grid grid-cols-[repeat(auto-fit,minmax(min(100%,240px),1fr))] gap-4">
          {cassava.derivatives.map((g) => (
            <li key={g.group}>
              <Link
                href="/manioc#derives"
                className="afa-card sticker group flex h-full flex-col gap-2 bg-sand px-6 py-[22px] text-ink"
              >
                <span className="eyebrow text-accent-text">
                  {g.items.length} {g.group === "Toute la plante" ? "usages" : "dérivés"}
                </span>
                <span className="text-[26px] font-extrabold tracking-[-0.02em] group-hover:underline">
                  {g.group}
                </span>
                <span className="text-[15px] text-ink-soft">{derivativePreview[g.group]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>

      {/* 05 — Carte (aperçu vivant) */}
      <Panel tone="night" labelledBy="t-carte" bare className="h-[max(640px,88svh)] overflow-hidden">
        <AfaMap mode="teaser" className="absolute inset-0" />
        <div className="pointer-events-none relative z-[2] flex max-w-[560px] flex-col gap-[18px] px-[clamp(20px,4vw,64px)] py-[clamp(28px,4.5vw,72px)] max-sm:bg-[linear-gradient(rgba(20,26,16,.92),rgba(20,26,16,.6)_75%,transparent)]">
          <p className="eyebrow text-mint">05 — Déploiement national</p>
          <h2 id="t-carte" className="h-section text-white">
            Du N&apos;Zi à toute la Côte d&apos;Ivoire.
          </h2>
          <p className="max-w-[46ch] text-[17px] leading-[1.55] text-sand sm:text-[18px]">
            Après sa région d&apos;origine, AFA prévoit de se déployer dans la Nawa, puis progressivement dans
            les autres régions du pays.
          </p>
          <p className="hand text-[clamp(30px,2.6vw,40px)] text-accent">
            On ne regarde pas la carte. On entre dans le territoire.
          </p>
          <PillLink
            href="/carte"
            variant="orange"
            size="lg"
            className="pointer-events-auto mt-1.5 self-start"
          >
            Entrer dans le territoire <Arrow />
          </PillLink>
          <DeploymentBar dark className="pointer-events-auto mt-4 w-full max-w-[420px]" />
        </div>
      </Panel>

      {/* Veille du vivrier (masquée tant qu'aucune information n'est publiée) */}
      {news.length > 0 && (
        <Panel tone="sand" labelledBy="t-veille">
          <SectionHead
            id="t-veille"
            eyebrow="Veille du vivrier"
            title="Les dernières informations agricoles."
            intro="Collectées toutes les deux heures auprès de l'AIP, du CNRA, de l'ANADER et de la presse ivoirienne. Chaque information renvoie vers sa source."
            action={
              <PillLink href="/veille" variant="outline" size="md">
                Toute la veille <Arrow />
              </PillLink>
            }
          />
          <ul className="grid gap-4 md:grid-cols-2">
            {news.map((it) => (
              <li key={it.id} className="flex">
                <NewsListItem item={it} />
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* 06 — Rejoindre */}
      <Panel
        tone="orange"
        labelledBy="t-rejoindre"
        className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] items-center gap-[clamp(28px,4vw,64px)] overflow-hidden py-[clamp(32px,5vw,80px)]"
      >
        <div className="relative flex flex-col gap-5">
          <p className="eyebrow">06 — Le réseau AFA</p>
          <h2 id="t-rejoindre" className="ink-title text-[clamp(76px,11vw,190px)]">
            Et vous<span className="ml-[0.12em]">?</span>
          </h2>
          <p className="max-w-[46ch] text-[18px] leading-normal font-medium sm:text-[19px]">
            Productrices, producteurs, coopératives, commerçantes : AFA rassemble les acteurs du manioc et du
            vivrier pour créer des débouchés, des formations et des opportunités de financement.
          </p>
          <Notebook
            rotate={-4}
            margin={40}
            className="mt-2 py-3.5 pr-9 pl-14"
            textClassName="text-[clamp(40px,4.5vw,64px)]"
          >
            Moi aussi, je suis AFA.
          </Notebook>
        </div>
        <ul className="flex flex-col gap-3">
          {joinProfiles.map((label, i) => (
            <li key={label}>
              <Link
                href={`${links.join}#profils`}
                data-magnetic=""
                className={
                  i === 0
                    ? "flex min-h-[76px] items-center justify-between gap-4 rounded-full bg-ink px-7 text-[clamp(18px,1.6vw,22px)] font-extrabold tracking-[-0.01em] text-sand hover:bg-forest"
                    : "flex min-h-[76px] items-center justify-between gap-4 rounded-full border-2 border-ink px-7 text-[clamp(18px,1.6vw,22px)] font-extrabold tracking-[-0.01em] hover:bg-ink hover:text-sand"
                }
              >
                {label} <Arrow />
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
