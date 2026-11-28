"use client";

import Link from "next/link";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { links } from "@/config/navigation";
import { results } from "@/content/afa";

const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
type SceneDef = { paper: { x: number; y: number; rot: number; w: number; text: string }; spots: Spot[] };

/** Scène unique (photo fixe, décision de l'ONG) : la productrice à la houe, fond blanc. */
const SCENE: SceneDef = {
  paper: { x: -90, y: 450, rot: -6, w: 440, text: "Je suis AFA" },
  spots: [
    {
      x: 411,
      y: 232,
      lx: 60,
      ly: 10,
      bend: -40,
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
};
const BOX: [number, number, number, number] = [150, 160, 523, 700];

type Status = "org" | "active" | "upcoming" | "later" | "country" | "people";
/**
 * Ce qui change : le grand mot après « Je suis ». Régions : articles d'usage ; statuts identiques à la
 * carte (N'Zi implantée, Nawa prochaine étape, autres régions ensuite).
 */
const WORDS: { t: string; tag: string; status: Status }[] = [
  { t: "AFA", tag: "ONG ivoirienne · depuis 2016", status: "org" },
  { t: "le N'Zi", tag: "Région · AFA implantée", status: "active" },
  { t: "la Nawa", tag: "Région · prochaine étape", status: "upcoming" },
  { t: "le Bélier", tag: "Région · déploiement progressif", status: "later" },
  { t: "le Gbêkê", tag: "Région · déploiement progressif", status: "later" },
  { t: "l'Iffou", tag: "Région · déploiement progressif", status: "later" },
  { t: "la Marahoué", tag: "Région · déploiement progressif", status: "later" },
  { t: "le Poro", tag: "Région · déploiement progressif", status: "later" },
  { t: "le Tonkpi", tag: "Région · déploiement progressif", status: "later" },
  { t: "la Côte d'Ivoire", tag: "Tout le pays", status: "country" },
  { t: "ivoirienne", tag: "Moi aussi, je suis AFA", status: "people" },
  { t: "ivoirien", tag: "Moi aussi, je suis AFA", status: "people" },
];
const STEP_MS = 2400;
const INK = "#1d2417";
const PEN = "#1f3f9e";

function StatusMark({ status }: { status: Status }) {
  const c =
    status === "active" ? (
      <circle cx="10" cy="10" r="7" fill="#4a7230" stroke="#1d2417" strokeWidth="1.6" />
    ) : status === "upcoming" ? (
      <circle cx="10" cy="10" r="7" fill="#fff" stroke="#df8433" strokeWidth="2" strokeDasharray="3 2.4" />
    ) : status === "later" ? (
      <circle cx="10" cy="10" r="7" fill="#efe6d2" stroke="#1d2417" strokeWidth="1.4" />
    ) : (
      <circle cx="10" cy="10" r="7" fill="#df8433" stroke="#1d2417" strokeWidth="1.6" />
    );
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" aria-hidden="true" className="flex-none">
      {c}
    </svg>
  );
}

/** Taille du grand mot selon sa longueur (desktop `--wd`, mobile `--wm`). */
function wordVars(t: string): CSSProperties {
  const n = t.replace(/'/g, "").length;
  if (n <= 3)
    return { ["--wd" as string]: "clamp(120px,21vw,390px)", ["--wm" as string]: "clamp(92px,29vw,190px)" };
  const d = Math.min(21, 46 / (0.66 * n)).toFixed(2);
  const m = Math.min(29, 124 / n).toFixed(2);
  const max = Math.round(Math.min(390, 1140 / n));
  return {
    ["--wd" as string]: `clamp(56px,${d}vw,${max}px)`,
    ["--wm" as string]: `clamp(34px,${m}vw,${max}px)`,
  };
}

/**
 * Hero « Je suis AFA » (accueil). Photo fixe ; seul le grand mot change toutes les 2,4 s
 * (AFA, le N'Zi, la Nawa, les régions, la Côte d'Ivoire, ivoirienne, ivoirien), avec une étiquette de
 * contexte. Bouton pause (WCAG 2.2.2). Points cliquables sur la photo.
 * `header` : en-tête du site, rendu côté serveur.
 */
export function HeroJeSuisAfa({ header }: { header: ReactNode }) {
  const [{ w, prev }, setWords] = useState<{ w: number; prev: number | null }>({ w: 0, prev: null });
  const [paused, setPaused] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [compact, setCompact] = useState(false);

  useEffect(() => {
    if (paused || open !== null) return;
    const t = window.setInterval(() => {
      setWords((cur) => ({ prev: cur.w, w: (cur.w + 1) % WORDS.length }));
    }, STEP_MS);
    return () => window.clearInterval(t);
  }, [paused, open]);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1099px)");
    const apply = () => setCompact(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  const word = WORDS[w];
  const vars = {
    "--hbg": "#ffffff",
    "--hfg": "#1d2417",
    "--hbrush": "#df8433",
    "--hpulse": "#df8433",
    "--hcard": "#f7f2e8",
    "--hring": "rgba(29,36,23,.14)",
  } as CSSProperties;
  const openSpot = open !== null ? SCENE.spots[open] : null;
  const pc = (v: number, t: number) => `${(v / t) * 100}%`;
  const [bx, by, bw, bh] = BOX;

  return (
    <div className="panel-frame">
      <div
        data-hero=""
        style={{ ...vars, background: "var(--hbg)", color: "var(--hfg)" }}
        className="relative flex flex-col overflow-hidden rounded-[22px] p-[clamp(12px,2vw,26px)] sm:rounded-[28px] min-[1100px]:min-h-[calc(100svh-24px)]"
      >
        {header}

        <div
          id="contenu"
          tabIndex={-1}
          className="relative mt-3.5 grid flex-1 grid-cols-1 outline-none [grid-template-areas:'a'_'s'_'b'] min-[1100px]:grid-cols-2 min-[1100px]:grid-rows-[auto_1fr] min-[1100px]:[grid-template-areas:'a_s'_'b_s']"
        >
          {/* a — étiquette et titre */}
          <div className="relative z-[1] flex flex-col gap-3 pt-3 pl-1 [grid-area:a]">
            <div className="flex items-center gap-2">
              <p
                aria-hidden="true"
                key={`tag${w}`}
                className="inline-flex min-h-9 items-center gap-2 rounded-full border-[1.5px] border-ink bg-sand py-1 pr-4 pl-2.5 text-[12px] font-extrabold tracking-[0.08em] uppercase"
                style={{ animation: "afaPop .5s cubic-bezier(.2,.8,.2,1) both" }}
              >
                <StatusMark status={word.status} />
                {word.tag}
              </p>
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={paused ? "Relancer l'animation du titre" : "Mettre en pause l'animation du titre"}
                className="grid size-11 cursor-pointer place-items-center rounded-full text-ink/70 hover:bg-ink/8 hover:text-ink"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" aria-hidden="true">
                  {paused ? (
                    <path d="M4 2 L13 8 L4 14 Z" fill="currentColor" />
                  ) : (
                    <path d="M4 2 V14 M11 2 V14" stroke="currentColor" strokeWidth="2.5" />
                  )}
                </svg>
              </button>
            </div>

            <h1 className="m-0 font-ink leading-none font-normal whitespace-nowrap text-(--hfg)">
              <span className="sr-only">
                Je suis AFA, je suis la Côte d&apos;Ivoire : des femmes qui font pousser l&apos;avenir.
              </span>
              <span aria-hidden="true" className="hero-ink block pb-[0.08em]">
                <span className="hero-top block leading-[0.95]">Je suis</span>
                <span className="hero-word ml-[0.06em] grid items-start leading-[0.9]">
                  {prev !== null && (
                    <span
                      key={`pw${prev}-${w}`}
                      className="hero-word-size [grid-area:1/1]"
                      style={{ ...wordVars(WORDS[prev].t), animation: "afaMeltOut .45s ease-in both" }}
                    >
                      {WORDS[prev].t}
                    </span>
                  )}
                  <span
                    key={`w${w}`}
                    className="hero-word-size [grid-area:1/1]"
                    style={{
                      ...wordVars(word.t),
                      animation: prev !== null ? "afaMeltIn .6s cubic-bezier(.2,.8,.2,1) both" : "none",
                    }}
                  >
                    <span className="inline-flex whitespace-nowrap">
                      {[...word.t].map((ch, k) => (
                        <span
                          key={k}
                          className="inline-block whitespace-pre"
                          style={{ animation: `afaLetter .55s ${k * 32}ms cubic-bezier(.2,.9,.25,1.2) both` }}
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

          {/* s — photo */}
          <div className="relative z-[2] [grid-area:s] max-[1099px]:-mx-[clamp(12px,2vw,26px)] max-[1099px]:-mt-[10%] min-[1100px]:min-h-[min(78vh,760px)]">
            <div className="absolute inset-0 flex items-end justify-center [container-type:size] max-[1099px]:relative max-[1099px]:[container-type:normal]">
              <div className="relative aspect-[700/860] w-[min(100cqw,calc(100cqh*700/860))] max-[1099px]:w-[min(100%,calc(68svh*700/860))]">
                <div
                  className="absolute inset-0"
                  style={{
                    left: pc(bx, 700),
                    top: pc(by, 860),
                    width: pc(bw, 700),
                    height: pc(bh, 860),
                    transformOrigin: "50% 100%",
                    animation: "afaHeroIn 1.25s cubic-bezier(.75,0,.2,1) .1s both",
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- dimensions en % d'une scène SVG, srcset fait main (export statique) */}
                  <img
                    src={`${BASE}/photos/femme-houe.webp`}
                    srcSet={`${BASE}/photos/femme-houe-560.webp 560w, ${BASE}/photos/femme-houe.webp 900w`}
                    sizes="(min-width: 1100px) 46vw, 92vw"
                    alt="Une productrice souriante, casquette « Je suis AFA », houe sur l'épaule"
                    fetchPriority="high"
                    decoding="async"
                    className="absolute inset-0 block size-full object-contain object-bottom"
                  />
                </div>
                <svg
                  viewBox="0 0 700 860"
                  preserveAspectRatio="xMidYMax meet"
                  className="absolute inset-0 block size-full overflow-visible"
                >
                  <SceneLayer
                    sc={SCENE}
                    k={0}
                    run={0}
                    open={open}
                    f={1}
                    compact={compact}
                    setOpen={setOpen}
                  />
                </svg>
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

function SceneLayer({
  sc,
  k,
  run,
  open,
  f,
  compact,
  setOpen,
}: {
  sc: SceneDef;
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
