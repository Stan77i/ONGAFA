"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

/** Plaque du carrefour : une rubrique ou la dernière information d'un thème (toujours datée et sourcée). */
export type SignBlade = {
  label: string;
  tag: string;
  title: string;
  detail: string;
  href: string;
  cta: string;
};

const W = 600;
const H = 820;
const ROWS = [100, 214, 328, 442];
const CARD = { x: 34, y: 553 };
const pct = (v: number, t: number) => `${((v / t) * 100).toFixed(2)}%`;

function geo(i: number) {
  const left = i % 2 === 0;
  const x = left ? 70 : 348;
  const w = left ? 318 : 250;
  const dx = left ? x + 4 : x + w - 4;
  const dy = ROWS[i] + 46;
  const bend = left ? -70 : 60;
  const d = `M${dx},${dy} C${dx + bend},${dy + (CARD.y - dy) * 0.45} ${CARD.x + bend * 0.4},${CARD.y - (CARD.y - dy) * 0.4} ${CARD.x},${CARD.y}`;
  return { left, x, w, dx, dy, d };
}

/**
 * Carrefour de la veille : un poteau, des plaques qui pivotent tour à tour, un fil (même logique que
 * le hero de l'accueil) relie la plaque active à une fiche. Survol = pause ; clic = choix.
 */
export function Signpost({ blades, interval = 3600 }: { blades: SignBlade[]; interval?: number }) {
  const list = blades.slice(0, ROWS.length);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const hold = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (paused || list.length < 2) return;
    const t = window.setInterval(() => setActive((a) => (a + 1) % list.length), interval);
    return () => window.clearInterval(t);
  }, [paused, list.length, interval]);
  useEffect(() => () => window.clearTimeout(hold.current), []);

  if (list.length === 0) return null;
  const pick = (i: number) => {
    setActive(i);
    setPaused(true);
    window.clearTimeout(hold.current);
    hold.current = window.setTimeout(() => setPaused(false), 9000);
  };
  const cur = list[active];
  const g = list.map((_, i) => geo(i));
  const internal = cur.href.startsWith("/");
  const ctaClass =
    "mt-0.5 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-accent px-4 text-[14px] font-extrabold text-ink hover:bg-accent-hover";

  return (
    <div
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      className="relative mb-6 w-full max-w-[600px] justify-self-center"
      style={{ aspectRatio: `${W}/${H}`, containerType: "inline-size", perspective: 1100 }}
    >
      <svg
        viewBox={`0 0 ${W} ${H}`}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[7] size-full overflow-visible"
      >
        {g.map((p, i) => (
          <path
            key={i}
            d={p.d}
            fill="none"
            stroke="#1d2417"
            strokeWidth={1.6}
            strokeDasharray="2 6"
            strokeLinecap="round"
            opacity={0.35}
          />
        ))}
        <g key={active}>
          <path
            d={g[active].d}
            fill="none"
            stroke="#df8433"
            strokeWidth={3.2}
            strokeLinecap="round"
            pathLength={1}
            strokeDasharray="1"
            style={{ animation: "afaDrawFrom .9s cubic-bezier(.6,0,.3,1) both" }}
          />
          <circle
            r={5.5}
            fill="#df8433"
            stroke="#fff"
            strokeWidth={2}
            style={{ animation: "afaPop .3s .9s both" }}
          >
            <animateMotion dur="2.4s" begin="0s" repeatCount="indefinite" path={g[active].d} />
          </circle>
          <circle cx={CARD.x} cy={CARD.y} r={6} fill="#1d2417" stroke="#df8433" strokeWidth={2.5} />
        </g>
      </svg>

      {/* Poteau : le pied se fond dans le panneau */}
      <div
        aria-hidden="true"
        className="absolute top-[6%] -bottom-[6%] left-[59.8%] w-[3.8%] rounded-t-md border-[1.5px] border-b-0 border-ink"
        style={{
          background: "linear-gradient(90deg,#6f7569 0%,#c9ccc2 30%,#f1f2ec 45%,#a4a99c 70%,#5e6459 100%)",
          maskImage: "linear-gradient(180deg,#000 52%,transparent 80%)",
          WebkitMaskImage: "linear-gradient(180deg,#000 52%,transparent 80%)",
        }}
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-[55.4%] z-[6] grid aspect-square w-[12.6%] place-items-center rounded-full border-2 border-ink bg-sand shadow-[0_5px_0_#1d2417]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- export statique */}
        <img
          src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/brand/symbole-afa.webp`}
          alt=""
          className="size-[78%] object-contain"
        />
      </div>

      {list.map((b, i) => {
        const p = g[i];
        const on = i === active;
        return (
          <div key={b.label}>
            <div
              aria-hidden="true"
              className="absolute left-[57.6%] z-[2] flex h-[3.6%] w-[8.2%] items-center justify-between rounded-[4px] border-[1.5px] border-ink px-[6%]"
              style={{ top: pct(ROWS[i] - 14, H), background: "linear-gradient(180deg,#f1f2ec,#9aa094)" }}
            >
              <span className="size-[5px] rounded-full bg-ink" />
              <span className="size-[5px] rounded-full bg-ink" />
            </div>
            <button
              type="button"
              onClick={() => pick(i)}
              aria-pressed={on}
              className="absolute flex h-[11.1%] cursor-pointer items-center rounded-xl border-2 border-ink text-left font-sans"
              style={{
                left: pct(p.x, W),
                top: pct(ROWS[i], H),
                width: pct(p.w, W),
                gap: "2.4cqw",
                padding: p.left ? "0 6cqw 0 4cqw" : "0 3cqw 0 6cqw",
                justifyContent: "flex-start",
                transformOrigin: p.left ? "92% 50%" : "8% 50%",
                transform: on
                  ? "rotateY(0deg) translateZ(40px) scale(1.04)"
                  : `rotateY(${p.left ? 20 : -20}deg) rotateZ(${p.left ? 3 : -3}deg)`,
                zIndex: on ? 6 : 3,
                background: on ? "#2c4520" : "#df8433",
                color: on ? "#f7f2e8" : "#1d2417",
                boxShadow:
                  "0 7px 0 #1d2417, inset 0 2px 0 rgba(255,255,255,.35), inset 0 -10px 18px rgba(0,0,0,.12)",
                transition: "transform .7s cubic-bezier(.2,.8,.2,1), background .4s, color .4s",
              }}
            >
              <span
                aria-hidden="true"
                className="font-black opacity-80"
                style={{ fontSize: "clamp(11px,2.6cqw,15px)", order: p.left ? 0 : 2 }}
              >
                {p.left ? "←" : "→"}
              </span>
              <span
                className="min-w-0 leading-[1.02] font-black tracking-[-0.015em] uppercase [text-wrap:balance]"
                style={{ fontSize: p.left ? "clamp(12px,3.3cqw,21px)" : "clamp(11px,3cqw,19px)" }}
              >
                {b.label}
              </span>
            </button>
            <span
              aria-hidden="true"
              className="pointer-events-none absolute z-[7] -mt-[13px] -ml-[13px] grid size-[26px] place-items-center"
              style={{ left: pct(p.dx, W), top: pct(p.dy, H) }}
            >
              <span
                className="ps-pulse absolute size-[22px] rounded-full"
                style={{ ["--ps-lit" as string]: "#df8433" }}
              />
              <span
                className="relative size-[18px] rounded-full border-[2.5px] border-ink"
                style={{ background: on ? "#df8433" : "#f7f2e8" }}
              />
            </span>
          </div>
        );
      })}

      <div
        role="status"
        className="absolute left-0 z-[8] flex w-[58%] flex-col gap-2 rounded-[18px] border-2 border-ink bg-ink px-4 pt-3.5 pb-4 text-sand shadow-[0_6px_0_rgba(29,36,23,.9)]"
        style={{ top: pct(CARD.y, H) }}
      >
        <span className="flex justify-between gap-2 text-[12px] font-bold tracking-[0.1em] text-leaf-light uppercase">
          <span>{cur.tag}</span>
          <span>
            {active + 1} / {list.length}
          </span>
        </span>
        <span
          className="leading-[1.12] font-extrabold tracking-[-0.015em] [text-wrap:pretty]"
          style={{ fontSize: "clamp(15px,3.2cqw,20px)" }}
        >
          {cur.title}
        </span>
        <span className="text-[14px] leading-[1.4] text-cream">{cur.detail}</span>
        {internal ? (
          <Link href={cur.href} className={ctaClass}>
            {cur.cta} <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <a href={cur.href} className={ctaClass}>
            {cur.cta} <span aria-hidden="true">→</span>
          </a>
        )}
      </div>

      <div
        aria-hidden="true"
        className="hand absolute top-[71%] left-[64%] z-[4] -rotate-[7deg] bg-paper px-4 pt-1.5 pb-1 whitespace-nowrap text-pen shadow-[0_8px_14px_rgba(29,36,23,.22)]"
        style={{ fontSize: "clamp(26px,6cqw,40px)" }}
      >
        daté &amp; sourcé
      </div>
    </div>
  );
}
