"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { links } from "@/config/navigation";
import { results } from "@/content/afa";
import { cn } from "@/lib/cn";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const photo = (name: string) => ({
  src: `${BASE}/photos/${name}.webp`,
  srcSet: `${BASE}/photos/${name}-560.webp 560w, ${BASE}/photos/${name}.webp 900w`,
});

type Spot = {
  x: number;
  y: number;
  lx: number;
  ly: number;
  bend: number;
  t: string;
  d: string;
  tag?: string;
  src?: boolean;
};
type Scene = {
  key: string;
  load: string;
  bg: string;
  fg: string;
  brush: string;
  pulse: string;
  ring: string;
  num: string;
  cap: [string, string];
  top: string;
  words: [string, string, string];
  kind: "cut" | "arch";
  img: { src: string; srcSet: string };
  alt: string;
  box: [number, number, number, number];
  paper: { x: number; y: number; rot: number; w: number; text: string };
  spots: Spot[];
};

/** Trois scènes : la couleur du hero suit la photo. Faits repris du bilan déclaré (src/content/afa.ts). */
const SCENES: Scene[] = [
  {
    key: "houe",
    load: "#df8433",
    bg: "#ffffff",
    fg: "#1d2417",
    brush: "#df8433",
    pulse: "#df8433",
    ring: "rgba(29,36,23,.14)",
    num: "01",
    cap: ["Production", "Région du N'Zi"],
    top: "Je suis",
    words: ["AFA", "la terre", "le manioc"],
    kind: "cut",
    img: photo("femme-houe"),
    alt: "Une productrice souriante, casquette « Je suis AFA », houe sur l'épaule",
    box: [150, 160, 523, 700],
    paper: { x: -90, y: 450, rot: -6, w: 440, text: "Je suis AFA" },
    spots: [
      {
        x: 411,
        y: 232,
        lx: -170,
        ly: 20,
        bend: -60,
        t: "Femmes & revenus",
        d: "Insertion économique des femmes et activités génératrices de revenus.",
      },
      {
        x: 497,
        y: 690,
        lx: 430,
        ly: -24,
        bend: 230,
        t: results.items[0].value,
        d: results.items[0].label + ".",
        src: true,
      },
    ],
  },
  {
    key: "groupe",
    load: "#4a7230",
    bg: "#df8433",
    fg: "#1d2417",
    brush: "#f7f2e8",
    pulse: "#f7f2e8",
    ring: "rgba(29,36,23,.14)",
    num: "02",
    cap: ["Coopératives", "Région du N'Zi"],
    top: "Nous sommes",
    words: ["AFA", "unies", "le N'Zi"],
    kind: "cut",
    img: photo("femmes-groupe"),
    alt: "Des productrices tenant maïs et manioc",
    box: [0, 238, 700, 622],
    paper: { x: -130, y: 640, rot: -4, w: 590, text: "Nous sommes AFA" },
    spots: [
      {
        x: 273,
        y: 292,
        lx: -210,
        ly: 40,
        bend: -90,
        t: "Coopératives",
        d: "Structurées et accompagnées dans une dizaine de sous-préfectures du N'Zi.",
        src: true,
      },
      {
        x: 282,
        y: 487,
        lx: 120,
        ly: -30,
        bend: 40,
        t: "Maïs",
        d: "Seconde culture de l'objet d'AFA, de la production aux produits finis.",
      },
      {
        x: 532,
        y: 505,
        lx: 440,
        ly: 70,
        bend: 60,
        t: results.items[1].value,
        d: results.items[1].label + ".",
        src: true,
      },
    ],
  },
  {
    key: "casquette",
    load: "#df8433",
    bg: "#4a7230",
    fg: "#f7f2e8",
    brush: "#2c4520",
    pulse: "#f7f2e8",
    ring: "rgba(247,242,232,.16)",
    num: "03",
    cap: ["Autonomie", "des femmes"],
    top: "Je suis",
    words: ["AFA", "autonome", "l'avenir"],
    kind: "arch",
    img: photo("femme-casquette"),
    alt: "Une productrice souriante portant la casquette « Je suis AFA »",
    box: [150, 170, 500, 690],
    paper: { x: -100, y: 610, rot: -7, w: 440, text: "Je suis AFA" },
    spots: [
      {
        x: 401,
        y: 228,
        lx: -190,
        ly: 20,
        bend: -60,
        t: "Commercialisation",
        tag: "Perspective",
        d: "Financer la commercialisation et la bancarisation des commerçantes et des productrices.",
      },
      {
        x: 401,
        y: 562,
        lx: 450,
        ly: -14,
        bend: 230,
        t: "Autonomisation",
        d: "Des activités génératrices de revenus pour les personnes défavorisées.",
      },
    ],
  },
];

const N = SCENES.length;
const INK = "#1d2417";
const PEN = "#1f3f9e";
/** Moments où le grand mot change, en part de la durée de la scène. */
const WORD_STEPS = [0.42, 0.7];

type Word = { key: string; t: string };
type HeroState = {
  i: number;
  prev: number;
  run: number;
  w: number;
  open: number | null;
  paused: boolean;
  prevWord: Word | null;
  prevTop: { t: string; run: number } | null;
  topRun: number;
};

const wordOf = (s: HeroState) => SCENES[s.i].words[s.w] ?? "AFA";

/** Taille du grand mot selon sa longueur ; la hauteur du bloc reste fixe. */
function wordVars(t: string): CSSProperties {
  const n = t.replace(/'/g, "").length;
  if (n <= 3)
    return { ["--wd" as string]: "clamp(120px,21vw,390px)", ["--wm" as string]: "clamp(96px,30vw,190px)" };
  const d = Math.min(21, 46 / (0.66 * n)).toFixed(2);
  const m = Math.min(30, 128 / n).toFixed(2);
  const max = Math.round(Math.min(390, 1140 / n));
  return {
    ["--wd" as string]: `clamp(64px,${d}vw,${max}px)`,
    ["--wm" as string]: `clamp(34px,${m}vw,${max}px)`,
  };
}

/**
 * Hero « Je suis AFA » (accueil). Trois scènes de 7 s ; le compteur circulaire se remplit et,
 * plein, passe à l'image suivante. Pause et lecture conservent la progression.
 * Animations complètes pour tous les visiteurs (décision de l'ONG, T45) ; le bouton pause arrête le défilement.
 * `header` : en-tête du site, rendu côté serveur, dont les couleurs suivent la scène.
 */
export function HeroJeSuisAfa({
  header,
  intervalSeconds = 7,
}: {
  header: ReactNode;
  intervalSeconds?: number;
}) {
  const ms = intervalSeconds * 1000;
  /** Animations toujours actives (décision T45) ; conservé comme interrupteur unique. */
  const rm = false;
  const [s, setS] = useState<HeroState>({
    i: 0,
    prev: -1,
    run: 0,
    w: 0,
    open: null,
    paused: false,
    prevWord: null,
    prevTop: null,
    topRun: 0,
  });
  const clock = useRef<{ t0: number; pausedAt: number | null }>({ t0: 0, pausedAt: null });
  const lastRun = useRef(-1);

  const go = useCallback((n: number) => {
    setS((p) => {
      const i = ((n % N) + N) % N;
      const cur = SCENES[p.i];
      const next = SCENES[i];
      const topChanged = cur.top !== next.top;
      return {
        i,
        prev: p.i,
        run: p.run + 1,
        w: 0,
        open: null,
        paused: false,
        prevWord: { key: `${p.i}:${p.w}:${p.run}`, t: wordOf(p) },
        prevTop: topChanged ? { t: cur.top, run: p.topRun } : null,
        topRun: topChanged ? p.topRun + 1 : p.topRun,
      };
    });
  }, []);

  // Horloge : mots à 42 % et 70 % de la scène ; la pause fige le temps écoulé.
  const stopped = s.paused || s.open !== null;
  useEffect(() => {
    const c = clock.current;
    const now = Date.now();
    if (lastRun.current !== s.run) {
      lastRun.current = s.run;
      c.t0 = now;
      c.pausedAt = null;
    }
    if (stopped) {
      if (c.pausedAt === null) c.pausedAt = now;
      return;
    }
    if (c.pausedAt !== null) {
      c.t0 += now - c.pausedAt;
      c.pausedAt = null;
    }
    const el = now - c.t0;
    const timers = WORD_STEPS.map((p, k) => {
      const at = ms * p - el;
      return at > 0
        ? window.setTimeout(
            () =>
              setS((st) =>
                st.w >= k + 1
                  ? st
                  : { ...st, w: k + 1, prevWord: { key: `${st.i}:${st.w}:${st.run}`, t: wordOf(st) } },
              ),
            at,
          )
        : 0;
    });
    return () => timers.forEach((t) => t && window.clearTimeout(t));
  }, [s.run, stopped, ms]);

  const sc = SCENES[s.i];
  const vars = {
    "--hbg": sc.bg,
    "--hfg": sc.fg,
    "--hbrush": sc.brush,
    "--hpulse": sc.pulse,
    "--hcard": "#f7f2e8",
    "--hring": sc.ring,
  } as CSSProperties;
  const word = wordOf(s);
  const wordKey = `${s.i}:${s.w}:${s.run}`;
  const melt = (on: boolean) =>
    rm ? "none" : on ? "afaMeltIn .9s cubic-bezier(.2,.8,.2,1) both" : "afaMeltOut .7s ease-in both";
  const play = stopped ? "paused" : "running";
  const openSpot = s.open !== null ? sc.spots[s.open] : null;

  return (
    <div className="panel-frame">
      <div
        data-hero=""
        style={{ ...vars, background: "var(--hbg)", color: "var(--hfg)" }}
        className="relative flex flex-col overflow-hidden rounded-[22px] p-[clamp(12px,2vw,26px)] transition-[background-color,color] duration-[900ms] ease-out sm:rounded-[28px] min-[1100px]:min-h-[calc(100svh-24px)]"
      >
        {s.run > 0 && !rm && (
          <div
            key={`b${s.run}`}
            aria-hidden="true"
            className="pointer-events-none absolute top-[20%] left-[7%] z-0 size-[320vmax] rounded-full"
            style={{ background: sc.bg, animation: "afaBlot 1.1s cubic-bezier(.7,0,.25,1) both" }}
          />
        )}
        {header}

        <div
          id="contenu"
          tabIndex={-1}
          className="relative mt-3.5 grid flex-1 grid-cols-1 outline-none [grid-template-areas:'a'_'s'_'b'] min-[1100px]:grid-cols-2 min-[1100px]:grid-rows-[auto_1fr] min-[1100px]:[grid-template-areas:'a_s'_'b_s']"
        >
          {/* a — compteur et titre */}
          <div className="relative z-[1] flex flex-col gap-[18px] pt-2 pl-1 [grid-area:a]">
            <div className="flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={() => go(s.i + 1)}
                aria-label={`Image suivante (${sc.num} sur 0${N})`}
                title="Image suivante"
                className="relative size-[76px] flex-none cursor-pointer rounded-full"
              >
                <svg width="76" height="76" viewBox="0 0 76 76" className="block" aria-hidden="true">
                  <defs>
                    <clipPath id="afa-disc">
                      <circle cx="38" cy="38" r="35.5" />
                    </clipPath>
                  </defs>
                  <circle cx="38" cy="38" r="36" fill="#f7f2e8" />
                  <g clipPath="url(#afa-disc)">
                    <circle
                      key={`p${s.run}`}
                      cx="38"
                      cy="38"
                      r="18"
                      fill="none"
                      stroke={sc.load}
                      strokeWidth="37"
                      pathLength={1}
                      strokeDasharray="1"
                      strokeDashoffset="1"
                      transform="rotate(-90 38 38)"
                      style={{
                        transition: "stroke .9s",
                        animation: rm ? "none" : `afaRing ${ms}ms linear forwards`,
                        animationPlayState: play,
                      }}
                      onAnimationEnd={() => {
                        if (!rm) go(s.i + 1);
                      }}
                    />
                  </g>
                  <circle cx="38" cy="38" r="36" fill="none" stroke={INK} strokeWidth="2.5" />
                  <text
                    key={`n${s.run}`}
                    x="38"
                    y="46"
                    textAnchor="middle"
                    stroke="#f7f2e8"
                    strokeWidth="5"
                    strokeLinejoin="round"
                    paintOrder="stroke"
                    fill={INK}
                    style={{ font: "400 23px var(--font-ink)", animation: "afaPop .5s both" }}
                  >
                    {sc.num}
                  </text>
                </svg>
              </button>
              <div aria-live={stopped ? "polite" : "off"} className="flex min-w-[120px] flex-col gap-0.5">
                <span
                  key={`c${s.run}`}
                  className="text-[12px] leading-[1.3] font-extrabold tracking-[0.1em] uppercase"
                  style={{ animation: "afaPop .6s both" }}
                >
                  {sc.cap[0]}
                </span>
                <span
                  key={`d${s.run}`}
                  className="text-[12px] leading-[1.3] font-semibold tracking-[0.06em] uppercase opacity-85"
                  style={{ animation: "afaPop .6s .1s both" }}
                >
                  {sc.cap[1]}
                </span>
              </div>
              <div className="ml-1 flex items-center">
                {SCENES.map((scene, k) => {
                  const on = k === s.i;
                  const done = k < s.i;
                  return (
                    <button
                      key={scene.key}
                      type="button"
                      onClick={() => go(k)}
                      aria-label={`Scène ${k + 1} : ${scene.cap[0]}`}
                      aria-current={on ? "true" : undefined}
                      className="grid h-11 min-w-6 cursor-pointer place-items-center px-1"
                    >
                      <span
                        className="relative block h-3 overflow-hidden rounded-full border-[1.5px] border-current transition-[width] duration-[600ms] ease-[cubic-bezier(.2,.8,.2,1)]"
                        style={{ width: on ? 46 : 12, background: done ? "currentColor" : "transparent" }}
                      >
                        {on && (
                          <span
                            key={`f${s.run}`}
                            className="absolute inset-0 origin-left bg-current"
                            style={{
                              animation: rm ? "none" : `afaFill ${ms}ms linear both`,
                              animationPlayState: play,
                            }}
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
                <button
                  type="button"
                  onClick={() => setS((p) => ({ ...p, paused: !p.paused }))}
                  aria-label={s.paused ? "Lancer le défilement" : "Mettre en pause"}
                  className="grid size-11 cursor-pointer place-items-center"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                    {s.paused ? (
                      <path d="M4 2 L13 8 L4 14 Z" fill="currentColor" />
                    ) : (
                      <path d="M4 2 V14 M11 2 V14" stroke="currentColor" strokeWidth="2.5" />
                    )}
                  </svg>
                </button>
              </div>
            </div>

            <h1 className="m-0 font-ink leading-none font-normal whitespace-nowrap text-(--hfg)">
              <span className="sr-only">
                Je suis AFA. Nous sommes AFA : des femmes qui font pousser l&apos;avenir.
              </span>
              <span aria-hidden="true" className="hero-ink block py-[0.04em] pb-[0.1em]">
                <span className="hero-top grid leading-[1.02]">
                  {s.prevTop && !rm && (
                    <span
                      key={`pt${s.prevTop.t}${s.prevTop.run}`}
                      className="[grid-area:1/1]"
                      style={{ animation: melt(false) }}
                    >
                      {s.prevTop.t}
                    </span>
                  )}
                  <span
                    key={`t${sc.top}${s.topRun}`}
                    className="[grid-area:1/1]"
                    style={{ animation: s.prevTop ? melt(true) : "none" }}
                  >
                    {sc.top}
                  </span>
                </span>
                <span className="hero-word -mt-[0.04em] ml-[0.1em] grid items-center leading-[0.92]">
                  {s.prevWord && !rm && (
                    <span
                      key={`pw${s.prevWord.key}`}
                      className="hero-word-size [grid-area:1/1]"
                      style={{ ...wordVars(s.prevWord.t), animation: melt(false) }}
                    >
                      {s.prevWord.t}
                    </span>
                  )}
                  <span
                    key={`w${wordKey}`}
                    className="hero-word-size [grid-area:1/1]"
                    style={{ ...wordVars(word), animation: s.prevWord ? melt(true) : "none" }}
                  >
                    <span className="inline-flex whitespace-nowrap">
                      {[...word].map((ch, k) => (
                        <span
                          key={k}
                          className="inline-block whitespace-pre"
                          style={{
                            animation: rm
                              ? "none"
                              : `afaLetter .7s ${k * 55}ms cubic-bezier(.2,.9,.25,1.2) both`,
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </span>
                  </span>
                </span>
              </span>
            </h1>
          </div>

          {/* s — scène photo */}
          <div className="relative z-[2] [grid-area:s] max-[1099px]:-mx-[clamp(12px,2vw,26px)] max-[1099px]:-mt-[14%] min-[1100px]:min-h-[min(78vh,760px)]">
            <div className="absolute inset-0 flex items-end justify-center [container-type:size] max-[1099px]:relative max-[1099px]:[container-type:normal]">
              <div className="relative aspect-[700/860] w-[min(100cqw,calc(100cqh*700/860))] max-[1099px]:w-[min(100%,calc(68svh*700/860))]">
                <Stage s={s} rm={rm} ms={ms} setOpen={(open) => setS((p) => ({ ...p, open }))} />
              </div>
            </div>
            {openSpot && (
              <div
                role="status"
                className="absolute inset-x-3 bottom-3 z-[3] flex flex-col gap-1.5 rounded-[18px] border-2 border-ink bg-ink px-4 pt-2.5 pb-3 text-sand shadow-[0_6px_0_rgba(29,36,23,.9)] min-[1100px]:hidden"
                style={{ animation: "afaPop .4s both" }}
              >
                <span className="text-[12px] font-bold tracking-[0.1em] uppercase opacity-75">
                  {openSpot.tag ?? "Ce que fait AFA"}
                </span>
                <span className="text-[22px] leading-[1.05] font-extrabold tracking-[-0.02em]">
                  {openSpot.t}
                </span>
                <span className="text-[16px] leading-[1.35]">{openSpot.d}</span>
                {openSpot.src && (
                  <span className="text-[13px] opacity-80">
                    {results.period} · Source : {results.source}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* b — accroche et appels */}
          <div className="relative z-[1] mt-6 flex flex-col gap-[22px] self-end [grid-area:b] min-[1100px]:mt-0">
            <p className="m-0 flex flex-col items-start pl-[clamp(0px,8vw,140px)] text-[clamp(26px,3.3vw,52px)] leading-[0.98] font-extrabold tracking-[-0.015em] uppercase">
              <span className="flex items-center gap-[0.18em]">
                Des femmes <BigArrow up />
              </span>
              <span className="flex items-center gap-[0.18em]">
                <BigArrow /> qui font pousser
              </span>
              <span className="flex items-center gap-[0.25em]">
                l&apos;
                <span className="relative isolate">
                  avenir
                  <Brush />
                </span>
              </span>
            </p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <a
                href="#histoire"
                className="flex min-h-12 flex-col justify-end gap-2.5 text-[11.5px] font-bold tracking-[0.08em] uppercase"
              >
                <svg width="26" height="34" viewBox="0 0 26 34" aria-hidden="true" className="anim-bob">
                  <path
                    d="M13 2 V31 M3 21 L13 31 L23 21"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Défiler pour explorer</span>
              </a>
              <div className="flex max-w-[260px] flex-col gap-2">
                <p className="m-0 text-[12px] leading-[1.35] font-bold tracking-[0.04em] uppercase">
                  ONG ivoirienne reconnue depuis 2016, présidée par l&apos;Honorable N&apos;ZI N&apos;DA
                  AFFOUÉ Éliane.
                </p>
                <svg width="120" height="14" viewBox="0 0 120 14" aria-hidden="true">
                  <path
                    d="M3 9 C30 3 70 4 116 6 M10 12 C40 8 70 9 96 10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                </svg>
                <Link
                  href={links.join}
                  className="flex min-h-11 items-center justify-between gap-3 border-b-[1.5px] border-current text-[12px] font-extrabold tracking-[0.06em] uppercase"
                >
                  Rejoindre AFA
                  <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
                    <path
                      d="M1 7 H20 M14 1 L20 7 L14 13"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BigArrow({ up = false }: { up?: boolean }) {
  return (
    <svg viewBox="0 0 40 40" aria-hidden="true" className="size-[0.82em] flex-none">
      <path
        d={up ? "M20 36 V5 M8 16 L20 4 L32 16" : "M20 4 V35 M8 24 L20 36 L32 24"}
        fill="none"
        stroke="currentColor"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Brush() {
  const st: CSSProperties = { stroke: "var(--hbrush,#f7f2e8)", transition: "stroke .9s" };
  return (
    <svg
      viewBox="0 0 320 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="absolute -bottom-[0.3em] -left-[6%] -z-10 h-[0.6em] w-[116%] overflow-visible"
    >
      <path d="M8 30 C80 18 190 16 312 22" fill="none" style={st} strokeWidth="16" strokeLinecap="round" />
      <path d="M30 46 C110 34 210 34 300 36" fill="none" style={st} strokeWidth="9" strokeLinecap="round" />
      <path d="M120 56 C180 48 240 48 290 50" fill="none" style={st} strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

function Stage({
  s,
  rm,
  ms,
  setOpen,
}: {
  s: HeroState;
  rm: boolean;
  ms: number;
  setOpen: (o: number | null) => void;
}) {
  const [compact, setCompact] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1099px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // Photos des scènes 2 et 3 : téléchargées après le chargement de la page (hors chemin critique).
  const [later, setLater] = useState(false);
  useEffect(() => {
    const go = () => window.setTimeout(() => setLater(true), 300);
    if (document.readyState === "complete") go();
    else window.addEventListener("load", go, { once: true });
    return () => window.removeEventListener("load", go);
  }, []);

  const f = Math.min(1, ms / 5000);
  const pc = (v: number, t: number) => `${(v / t) * 100}%`;

  return (
    <>
      <div className="absolute inset-0">
        {SCENES.map((sc, k) => {
          const active = k === s.i;
          const mode = active ? "in" : k === s.prev ? "out" : "wait";
          const [bx, by, bw, bh] = sc.box;
          const figSt: CSSProperties = {
            position: "absolute",
            left: pc(bx, 700),
            top: pc(by, 860),
            width: pc(bw, 700),
            height: pc(bh, 860),
            opacity: mode === "in" ? 1 : 0,
            clipPath: mode === "wait" ? "circle(0% at 50% 82%)" : "circle(140% at 50% 82%)",
            transform: mode === "out" ? "scale(.9) translateX(-6%)" : "none",
            filter: mode === "out" ? "blur(12px) saturate(.6)" : "none",
            transformOrigin: "50% 100%",
            transition:
              mode === "in"
                ? "clip-path 1.25s cubic-bezier(.75,0,.2,1) .12s, opacity .25s .12s, transform 1s cubic-bezier(.2,.7,.2,1), filter .6s"
                : "opacity .7s ease, transform .9s cubic-bezier(.4,0,.2,1), filter .7s ease, clip-path 0s .95s",
            animation: active && !rm ? `afaKen ${ms + 1500}ms cubic-bezier(.2,.6,.3,1) both` : "none",
          };
          const rad = `50% 50% 0 0 / ${((bw / 2 / bh) * 100).toFixed(2)}% ${((bw / 2 / bh) * 100).toFixed(2)}% 0 0`;
          const img = (
            // eslint-disable-next-line @next/next/no-img-element -- dimensions en % d'une scène SVG, srcset fait main (export statique)
            <img
              src={k === 0 || later || k === s.i ? sc.img.src : undefined}
              srcSet={k === 0 || later || k === s.i ? sc.img.srcSet : undefined}
              sizes="(min-width: 1100px) 46vw, 92vw"
              alt={active ? sc.alt : ""}
              aria-hidden={!active}
              loading={k === 0 ? "eager" : "lazy"}
              fetchPriority={k === 0 ? "high" : "auto"}
              decoding="async"
              className={cn(
                "absolute inset-0 block size-full",
                sc.kind === "arch"
                  ? "border-[2.5px] border-ink object-cover object-top"
                  : "object-contain object-bottom",
              )}
              style={sc.kind === "arch" ? { borderRadius: rad } : undefined}
            />
          );
          return (
            <div key={sc.key} style={figSt}>
              {sc.kind === "arch" && (
                <div
                  className="absolute inset-0 translate-x-[3%] translate-y-[2%] bg-accent"
                  style={{ borderRadius: rad }}
                />
              )}
              {img}
            </div>
          );
        })}
      </div>

      <svg
        viewBox="0 0 700 860"
        preserveAspectRatio="xMidYMax meet"
        className="absolute inset-0 block size-full overflow-visible"
      >
        {SCENES.map((sc, k) => {
          const active = k === s.i;
          const tx = active ? 0 : k === s.prev ? -160 : 180;
          return (
            <g
              key={sc.key}
              aria-hidden={!active}
              style={{
                opacity: active ? 1 : 0,
                transform: `translateX(${tx}px)`,
                transition: "opacity .7s ease, transform 1s cubic-bezier(.2,.7,.2,1)",
                pointerEvents: active ? "auto" : "none",
              }}
            >
              {active && (
                <SceneLayer
                  key={`${k}-${s.run}`}
                  sc={sc}
                  k={k}
                  run={s.run}
                  open={s.open}
                  f={f}
                  compact={compact}
                  setOpen={setOpen}
                />
              )}
            </g>
          );
        })}
      </svg>
    </>
  );
}

function SceneLayer({
  sc,
  k,
  run,
  open,
  f,
  compact,
  setOpen,
}: {
  sc: Scene;
  k: number;
  run: number;
  open: number | null;
  f: number;
  compact: boolean;
  setOpen: (o: number | null) => void;
}) {
  const p = sc.paper;
  const id = `wc-${k}-${run}`;
  const lines = [];
  for (let ly = 38; ly < 140; ly += 30)
    lines.push(
      <line key={ly} x1={0} x2={p.w} y1={ly} y2={ly} stroke="#9fb3d9" strokeWidth={1.2} opacity={0.7} />,
    );
  // Mobile : la feuille reste dans le cadre (la maquette la faisait déborder à gauche).
  const px = compact ? Math.max(p.x, 24) : p.x;
  const scale = compact ? Math.min(1, 560 / p.w) : 1;

  return (
    <>
      {!compact &&
        sc.spots.map((spot, j) => {
          const ax = spot.lx + 22;
          const ay = spot.ly + 50;
          const c1x = spot.x + spot.bend;
          const c1y = spot.y - (spot.y - ay) * 0.45;
          const c2x = ax + spot.bend * 0.25;
          const c2y = ay + (spot.y - ay) * 0.55;
          return (
            <path
              key={`t${j}`}
              d={`M${spot.x},${spot.y} C${c1x},${c1y} ${c2x},${c2y} ${ax},${ay}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1.8}
              strokeDasharray="1"
              pathLength={1}
              strokeDashoffset={1}
              vectorEffect="non-scaling-stroke"
              style={{
                animation: `afaDraw ${0.9 * f}s ${(2.3 + j * 0.35) * f}s cubic-bezier(.6,0,.3,1) forwards`,
              }}
            />
          );
        })}

      <g transform={`translate(${px},${p.y}) rotate(${p.rot}) scale(${scale})`} aria-hidden="true">
        <g style={{ animation: `afaFloat 7s ${2.4 * f}s ease-in-out infinite`, willChange: "transform" }}>
          <g
            style={{
              animation: `afaPaper ${0.6 * f}s ${0.2 * f}s cubic-bezier(.2,.8,.2,1) both`,
              transformBox: "fill-box",
              transformOrigin: "center",
            }}
          >
            <rect width={p.w} height={140} rx={3} fill="#fbf7ee" filter="url(#afa-shadow)" />
            {lines}
            <line x1={44} x2={44} y1={0} y2={140} stroke="#c0392b" strokeWidth={1.2} opacity={0.45} />
            <rect
              x={p.w / 2 - 46}
              y={-12}
              width={92}
              height={26}
              fill="rgba(255,255,255,.6)"
              transform={`rotate(3 ${p.w / 2} 0)`}
            />
            <defs>
              <clipPath id={id}>
                <rect
                  x={0}
                  y={0}
                  width={p.w}
                  height={140}
                  style={{
                    transformBox: "fill-box",
                    transformOrigin: "left center",
                    animation: `afaWrite ${1.5 * f}s ${0.7 * f}s cubic-bezier(.45,.1,.6,.95) both`,
                  }}
                />
              </clipPath>
            </defs>
            <text
              x={60}
              y={104}
              clipPath={`url(#${id})`}
              fill={PEN}
              style={{ fontFamily: "var(--font-hand)", fontSize: 86 }}
            >
              {p.text}
            </text>
            <path
              d={`M60,122 C${p.w * 0.35},112 ${p.w * 0.6},128 ${p.w - 40},114`}
              fill="none"
              stroke={PEN}
              strokeWidth={3.2}
              strokeLinecap="round"
              pathLength={1}
              strokeDasharray="1"
              strokeDashoffset={1}
              style={{ animation: `afaDraw ${0.5 * f}s ${2.2 * f}s ease-out forwards` }}
            />
          </g>
        </g>
      </g>

      {sc.spots.map((spot, j) => {
        const on = open === j;
        const toggle = () => setOpen(on ? null : j);
        return (
          <g
            key={`s${j}`}
            transform={`translate(${spot.x},${spot.y})`}
            role="button"
            tabIndex={0}
            aria-label={`${spot.t} : ${spot.d}`}
            aria-expanded={on}
            onClick={(e) => {
              e.stopPropagation();
              toggle();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                toggle();
              }
              if (e.key === "Escape" && on) setOpen(null);
            }}
            className="hero-spot cursor-pointer outline-none"
          >
            <g style={{ animation: `afaPop .4s ${(1.9 + j * 0.3) * f}s both` }}>
              <circle r={30} fill="transparent" />
              <circle
                className="hero-spot-focus"
                r={21}
                fill="none"
                strokeWidth={3}
                style={{ stroke: "var(--hfg)" }}
              />
              <circle
                r={11}
                fill="none"
                strokeWidth={2.5}
                style={{
                  stroke: "var(--hpulse,#f7f2e8)",
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  animation: "afaPulse 3.6s cubic-bezier(.2,.6,.3,1) infinite",
                }}
              />
              <circle
                r={13}
                stroke={INK}
                strokeWidth={3}
                style={{ fill: on ? INK : "var(--hcard,#f7f2e8)" }}
              />
              <path
                d={on ? "M-5,0 H5" : "M-5,0 H5 M0,-5 V5"}
                stroke={on ? "#f7f2e8" : INK}
                strokeWidth={3}
                strokeLinecap="round"
              />
            </g>
          </g>
        );
      })}

      {!compact &&
        sc.spots.map((spot, j) => {
          const on = open === j;
          return (
            <foreignObject
              key={`l${j}`}
              x={spot.lx}
              y={spot.ly}
              width={270}
              height={230}
              style={{ overflow: "visible", pointerEvents: "none" }}
              aria-hidden="true"
            >
              <div
                onClick={() => setOpen(on ? null : j)}
                className="inline-flex max-w-[260px] cursor-pointer flex-col gap-1.5 rounded-[18px] border-2 border-ink px-4 pt-2.5 pb-3 font-sans shadow-[0_6px_0_rgba(29,36,23,.9)] transition-colors duration-[250ms]"
                style={{
                  background: on ? INK : "var(--hcard,#f7f2e8)",
                  color: on ? "#f7f2e8" : INK,
                  animation: `afaPop .5s ${(2.7 + j * 0.35) * f}s both`,
                  pointerEvents: "auto",
                }}
              >
                <span className="text-[13px] font-bold tracking-[0.1em] uppercase opacity-75">
                  {spot.tag ?? "Ce que fait AFA"}
                </span>
                <span className="text-[25px] leading-[1.05] font-extrabold tracking-[-0.02em]">{spot.t}</span>
                {on && <span className="text-[17px] leading-[1.35]">{spot.d}</span>}
                {on && spot.src && (
                  <span className="text-[13px] opacity-80">
                    {results.period} · Source : {results.source}
                  </span>
                )}
              </div>
            </foreignObject>
          );
        })}
    </>
  );
}
