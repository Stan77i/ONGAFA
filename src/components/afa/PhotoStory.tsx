"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { results } from "@/content/afa";
import { cn } from "@/lib/cn";

/** Point d'information posé sur une photo (coordonnées en % de la photo). */
export type StorySpot = {
  /** Point sur la photo. */
  x: number;
  y: number;
  /** Coin haut-gauche de l'étiquette (peut sortir de la photo sur grand écran). */
  lx: number;
  ly: number;
  /** Courbure du fil (px). */
  bend?: number;
  t: string;
  d: string;
  tag?: string;
  /** Chiffre du bilan déclaré : affiche la source. */
  src?: boolean;
};

/**
 * Photo racontée : des points sur la photo, reliés par des fils animés à des étiquettes qui donnent
 * une information réelle (même logique que le hero de l'accueil). Les fils se tracent à l'arrivée à
 * l'écran, une lumière les parcourt ensuite ; survol ou clic les allument. Sur mobile, la fiche
 * s'ouvre sous la photo.
 */
export function PhotoStory({
  spots,
  children,
  className,
  ink = "#1d2417",
  lit = "#df8433",
}: {
  spots: StorySpot[];
  children: ReactNode;
  className?: string;
  /** Couleur des fils au repos. */
  ink?: string;
  /** Couleur d'un fil allumé et de la lumière. */
  lit?: string;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [seen, setSeen] = useState(false);
  const [open, setOpen] = useState<number | null>(null);
  const [hov, setHov] = useState<number | null>(null);
  const motions = useRef<(SVGAnimateMotionElement | null)[]>([]);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setSize({ w: e.contentRect.width, h: e.contentRect.height }));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);

  // Lumière sur chaque fil, une fois le fil tracé (décalée d'un fil à l'autre).
  useEffect(() => {
    if (!seen) return;
    const timers = spots.map((_, j) =>
      window.setTimeout(
        () => {
          const m = motions.current[j];
          if (!m) return;
          (m.parentElement as SVGElement | null)?.style.setProperty("opacity", "1");
          m.beginElement();
        },
        (1.6 + j * 0.7) * 1000,
      ),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [seen, spots]);

  const { w, h } = size;
  const openSpot = open !== null ? spots[open] : null;

  return (
    <div
      ref={box}
      className={cn("photo-story relative", className)}
      style={{ ["--ps-ink" as string]: ink, ["--ps-lit" as string]: lit } as CSSProperties}
    >
      {children}

      {/* Fils (grand écran) */}
      {w > 0 && (
        <svg
          width={w}
          height={h}
          viewBox={`0 0 ${w} ${h}`}
          className="pointer-events-none absolute inset-0 hidden overflow-visible sm:block"
          aria-hidden="true"
        >
          {spots.map((s, j) => {
            const x = (s.x / 100) * w;
            const y = (s.y / 100) * h;
            const ax = (s.lx / 100) * w + 20;
            const ay = (s.ly / 100) * h + 26;
            const b = s.bend ?? 40;
            const d = `M${x},${y} C${x + b},${y - (y - ay) * 0.5} ${ax + b * 0.3},${ay + (y - ay) * 0.5} ${ax},${ay}`;
            const on = hov === j || open === j;
            return (
              <g key={j} className={cn("ps-thread", on && "is-lit")}>
                <path
                  id={`ps-${j}-${Math.round(w)}`}
                  d={d}
                  fill="none"
                  pathLength={1}
                  strokeDasharray="1"
                  strokeDashoffset={seen ? undefined : 1}
                  style={
                    seen
                      ? { animation: `afaDrawFrom 1s ${0.5 + j * 0.3}s cubic-bezier(.6,0,.3,1) both` }
                      : undefined
                  }
                />
                <circle r={4.5} className="ps-dot">
                  <animateMotion
                    ref={(el) => {
                      motions.current[j] = el as SVGAnimateMotionElement | null;
                    }}
                    dur="2.4s"
                    begin="indefinite"
                    repeatCount="indefinite"
                    calcMode="spline"
                    keyTimes="0;1"
                    keySplines=".45 0 .25 1"
                  >
                    <mpath href={`#ps-${j}-${Math.round(w)}`} />
                  </animateMotion>
                </circle>
              </g>
            );
          })}
        </svg>
      )}

      {/* Points */}
      {spots.map((s, j) => {
        const on = open === j;
        return (
          <button
            key={`p${j}`}
            type="button"
            aria-expanded={on}
            aria-label={`${s.t} : ${s.d}`}
            onClick={() => setOpen(on ? null : j)}
            onPointerEnter={() => setHov(j)}
            onPointerLeave={() => setHov(null)}
            onFocus={() => setHov(j)}
            onBlur={() => setHov(null)}
            className="ps-spot absolute z-[3] grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-pointer place-items-center rounded-full"
            style={{
              left: `${s.x}%`,
              top: `${s.y}%`,
              animation: seen ? `afaPop .4s ${0.2 + j * 0.25}s both` : undefined,
              opacity: seen ? undefined : 0,
            }}
          >
            <span aria-hidden="true" className="ps-pulse absolute size-[22px] rounded-full" />
            <span
              aria-hidden="true"
              className={cn(
                "relative grid size-[26px] place-items-center rounded-full border-[2.5px] border-ink text-[15px] leading-none font-extrabold",
                on ? "bg-ink text-sand" : "bg-sand text-ink",
              )}
            >
              {on ? "–" : "+"}
            </span>
          </button>
        );
      })}

      {/* Étiquettes (grand écran) */}
      {spots.map((s, j) => {
        const on = open === j;
        return (
          <div
            key={`l${j}`}
            aria-hidden="true"
            onClick={() => setOpen(on ? null : j)}
            onPointerEnter={() => setHov(j)}
            onPointerLeave={() => setHov(null)}
            className={cn(
              "absolute z-[4] hidden max-w-[250px] cursor-pointer flex-col gap-1.5 rounded-[18px] border-2 border-ink px-4 pt-2.5 pb-3 shadow-[0_6px_0_rgba(29,36,23,.9)] transition-colors duration-200 sm:inline-flex",
              on ? "bg-ink text-sand" : "bg-sand text-ink",
            )}
            style={{
              left: `${s.lx}%`,
              top: `${s.ly}%`,
              animation: seen ? `afaPop .5s ${1 + j * 0.3}s both` : undefined,
              opacity: seen ? undefined : 0,
            }}
          >
            <span className="text-[12px] font-bold tracking-[0.1em] uppercase opacity-75">
              {s.tag ?? "Ce que fait AFA"}
            </span>
            <span className="text-[21px] leading-[1.05] font-extrabold tracking-[-0.02em]">{s.t}</span>
            {on && <span className="text-[15.5px] leading-[1.4]">{s.d}</span>}
            {on && s.src && (
              <span className="text-[12.5px] opacity-80">
                {results.period} · Source : {results.source}
              </span>
            )}
          </div>
        );
      })}

      {/* Fiche (mobile) */}
      {openSpot && (
        <div
          role="status"
          className="absolute inset-x-2 bottom-2 z-[5] flex flex-col gap-1.5 rounded-[18px] border-2 border-ink bg-ink px-4 pt-2.5 pb-3 text-sand shadow-[0_6px_0_rgba(29,36,23,.9)] sm:hidden"
          style={{ animation: "afaPop .35s both" }}
        >
          <span className="text-[12px] font-bold tracking-[0.1em] uppercase opacity-75">
            {openSpot.tag ?? "Ce que fait AFA"}
          </span>
          <span className="text-[20px] leading-[1.05] font-extrabold">{openSpot.t}</span>
          <span className="text-[15px] leading-[1.4]">{openSpot.d}</span>
          {openSpot.src && (
            <span className="text-[12.5px] opacity-80">
              {results.period} · Source : {results.source}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
