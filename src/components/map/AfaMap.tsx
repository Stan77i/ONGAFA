"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

/**
 * Carte nationale AFA, légère (SVG, sans WebGL) : relief par extrusion, inclinaison qui suit la souris,
 * régions qui se soulèvent au survol, zoom doux sur la région choisie, glisser pour explorer une fois zoomé.
 * Données : src/data/ci-regions.json (geoBoundaries, CC BY 4.0), chargées à l'approche de la section.
 * Statuts (forme ET couleur) : N'Zi implantée, Nawa prochaine étape, autres régions ensuite.
 *  - `teaser` (accueil) : un clic ouvre /carte#r=<région> ;
 *  - `full` (/carte) : panneau de région, légende, barre de déploiement, contrôles et clavier.
 */

type Region = { slug: string; name: string; d: string; label: [number, number] };
type MapData = { viewBox: string; source: string; regions: Region[] };
type Status = "active" | "upcoming" | "later";

const statusOf = (slug: string): Status =>
  slug === "nzi" ? "active" : slug === "nawa" ? "upcoming" : "later";
export const statusLabel: Record<Status, string> = {
  active: "AFA implantée",
  upcoming: "AFA bientôt",
  later: "Déploiement progressif",
};

function info(slug: string, name: string) {
  if (slug === "nzi")
    return {
      status: "active" as const,
      eyebrow: "AFA — Implantée",
      name: "Région du N'Zi",
      text: "Zone de naissance d'AFA. Plantations de manioc, unités de transformation et coopératives accompagnées dans une dizaine de sous-préfectures.",
      cta: { label: "Voir le bilan", href: "/a-propos#realisations" },
    };
  if (slug === "nawa")
    return {
      status: "upcoming" as const,
      eyebrow: "AFA — Prochaine étape",
      name: "Région de la Nawa",
      text: "Chef-lieu : Soubré. Première étape du déploiement national annoncé par AFA.",
      note: "Vous le saurez ici.",
      cta: { label: "Voir les étapes", href: "#chronologie" },
    };
  return {
    status: "later" as const,
    eyebrow: "Déploiement progressif",
    name,
    text: "Déploiement progressif sur l'ensemble du territoire national.",
    cta: { label: "Faire venir AFA", href: "/rejoindre-afa" },
  };
}

export function StatusShape({ status, size = 14 }: { status: Status; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" aria-hidden="true" className="flex-none">
      {status === "active" ? (
        <circle cx="10" cy="10" r="8" fill="#59883c" stroke="#a9c98f" strokeWidth="1.6" />
      ) : status === "upcoming" ? (
        <circle cx="10" cy="10" r="8" fill="none" stroke="#df8433" strokeWidth="2" strokeDasharray="3 2.4" />
      ) : (
        <circle cx="10" cy="10" r="8" fill="#2f4a22" stroke="rgba(247,242,232,.45)" strokeWidth="1.4" />
      )}
    </svg>
  );
}

const ease = (t: number) => 1 - Math.pow(1 - t, 3);
type VB = [number, number, number, number];

export function AfaMap({ mode, className }: { mode: "teaser" | "full"; className?: string }) {
  const full = mode === "full";
  const router = useRouter();
  const rootRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRefs = useRef(new Map<string, SVGPathElement>());
  const [data, setData] = useState<MapData | null>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [sel, setSel] = useState<string | null>(null);
  const [tip, setTip] = useState<{ x: number; y: number } | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const [dragging, setDragging] = useState(false);

  // Chargement des tracés à l'approche (hors du chemin critique de la page).
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let alive = true;
    const io = new IntersectionObserver(
      (es) => {
        if (!es.some((e) => e.isIntersecting)) return;
        io.disconnect();
        import("@/data/ci-regions.json").then((m) => alive && setData(m.default as unknown as MapData));
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => {
      alive = false;
      io.disconnect();
    };
  }, []);

  const fullVB = useMemo<VB>(() => {
    const [x, y, w, h] = (data?.viewBox ?? "0 0 1000 1057").split(/\s+/).map(Number);
    return [x, y, w, h];
  }, [data]);
  const vb = useRef<VB>([0, 0, 1000, 1057]);
  const anim = useRef(0);

  const applyVB = useCallback(
    (v: VB) => {
      vb.current = v;
      svgRef.current?.setAttribute("viewBox", v.map((n) => n.toFixed(1)).join(" "));
      rootRef.current?.style.setProperty("--z", (fullVB[2] / v[2]).toFixed(3));
    },
    [fullVB],
  );
  useEffect(() => applyVB(fullVB), [fullVB, applyVB]);

  const animateTo = useCallback(
    (to: VB, ms = 850) => {
      cancelAnimationFrame(anim.current);
      const from = [...vb.current] as VB;
      const t0 = performance.now();
      const step = (now: number) => {
        const k = ease(Math.min(1, (now - t0) / ms));
        applyVB(from.map((f, i) => f + (to[i] - f) * k) as VB);
        if (k < 1) anim.current = requestAnimationFrame(step);
      };
      anim.current = requestAnimationFrame(step);
      setZoomed(to[2] < fullVB[2] * 0.98);
    },
    [applyVB, fullVB],
  );

  /** Cadre la région dans la vue, en gardant les proportions de la carte. */
  const frame = useCallback(
    (slug: string) => {
      const p = pathRefs.current.get(slug);
      if (!p) return;
      const b = p.getBBox();
      const ratio = fullVB[2] / fullVB[3];
      // La région occupe environ un tiers de la vue : on garde le pays autour (lecture du contexte).
      let w = Math.max(b.width, b.height * ratio) * 3.4;
      w = Math.min(Math.max(w, fullVB[2] * 0.5), fullVB[2]);
      const h = w / ratio;
      // Sur grand écran, le panneau occupe la droite : la région se place dans l'espace libre à gauche.
      const rw = rootRef.current?.clientWidth ?? 0;
      const dx = rw > 1000 ? (200 / rw) * w : 0;
      const dy = rw > 1000 ? 0 : h * 0.12;
      animateTo([b.x + b.width / 2 - w / 2 + dx, b.y + b.height / 2 - h / 2 + dy, w, h]);
    },
    [animateTo, fullVB],
  );

  const panelTitle = useRef<HTMLHeadingElement>(null);
  const focusPanel = useRef(false);
  useEffect(() => {
    if (sel && focusPanel.current) {
      focusPanel.current = false;
      panelTitle.current?.focus();
    }
  }, [sel]);

  const select = useCallback(
    (slug: string | null) => {
      if (!full) {
        if (slug) router.push(`/carte#r=${slug}`);
        else router.push("/carte");
        return;
      }
      setSel(slug);
      if (slug) frame(slug);
      else animateTo(fullVB);
    },
    [full, router, frame, animateTo, fullVB],
  );

  // Arrivée depuis l'accueil : /carte#r=<région>.
  useEffect(() => {
    if (!full || !data) return;
    const m = window.location.hash.match(/r=([\w-]+)/);
    if (!m || !data.regions.some((r) => r.slug === m[1])) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    const t = window.setTimeout(() => select(m[1]), 450);
    return () => window.clearTimeout(t);
  }, [full, data, select]);

  // Inclinaison qui suit la souris (interpolée, arrêtée au repos).
  const tilt = useRef({ x: 0, y: 0, tx: 0, ty: 0, raf: 0 });
  const runTilt = useCallback(() => {
    const t = tilt.current;
    cancelAnimationFrame(t.raf);
    const step = () => {
      t.x += (t.tx - t.x) * 0.08;
      t.y += (t.ty - t.y) * 0.08;
      if (tiltRef.current)
        tiltRef.current.style.transform = `rotateX(${(16 - t.y * 7).toFixed(2)}deg) rotateY(${(t.x * 9).toFixed(2)}deg) rotateZ(${(-t.x * 1.2).toFixed(2)}deg)`;
      if (Math.abs(t.tx - t.x) > 0.001 || Math.abs(t.ty - t.y) > 0.001) t.raf = requestAnimationFrame(step);
    };
    t.raf = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(tilt.current.raf), []);

  // Glisser pour explorer (une fois zoomé).
  const drag = useRef<{ x: number; y: number; moved: number; vb: VB } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (!full || !zoomed || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, moved: 0, vb: [...vb.current] as VB };
  };
  const onPointerMove = (e: React.PointerEvent) => {
    const root = rootRef.current;
    if (!root) return;
    const r = root.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      tilt.current.tx = (e.clientX - r.left) / r.width - 0.5;
      tilt.current.ty = (e.clientY - r.top) / r.height - 0.5;
      runTilt();
      setTip({ x: e.clientX - r.left, y: e.clientY - r.top });
    }
    const d = drag.current;
    if (d) {
      const dx = e.clientX - d.x;
      const dy = e.clientY - d.y;
      d.moved = Math.abs(dx) + Math.abs(dy);
      if (d.moved > 4) {
        if (!dragging) setDragging(true);
        const s = d.vb[2] / r.width;
        cancelAnimationFrame(anim.current);
        applyVB([d.vb[0] - dx * s, d.vb[1] - dy * s, d.vb[2], d.vb[3]]);
      }
    }
  };
  const onPointerUp = () => {
    window.setTimeout(() => (drag.current = null), 0);
    setDragging(false);
  };
  const onLeave = () => {
    tilt.current.tx = 0;
    tilt.current.ty = 0;
    runTilt();
    setHover(null);
    setTip(null);
    drag.current = null;
  };

  const zoomBy = (f: number) => {
    const [x, y, w, h] = vb.current;
    const nw = Math.min(fullVB[2], Math.max(fullVB[2] * 0.3, w * f));
    const nh = nw * (h / w);
    animateTo([x + w / 2 - nw / 2, y + h / 2 - nh / 2, nw, nh], 500);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (!full) return;
    if (e.key === "+" || e.key === "=") zoomBy(0.75);
    else if (e.key === "-" || e.key === "_") zoomBy(1.33);
    else if (e.key === "0") select(null);
  };

  // Échap referme la région ouverte, même si le focus n'est pas dans la carte (clic à la souris).
  useEffect(() => {
    if (!full || sel === null) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !document.querySelector("dialog[open]")) select(null);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [full, sel, select]);

  const engaged = full && (sel !== null || zoomed);
  useEffect(() => {
    rootRef.current?.toggleAttribute("data-engaged", engaged);
  }, [engaged]);

  const regions = useMemo(() => data?.regions ?? [], [data]);
  // Ordre fixe (régions AFA au-dessus) : le réordonner au survol annulerait le premier clic.
  const order = useMemo(
    () =>
      [...regions].sort(
        (a, b) => (statusOf(a.slug) !== "later" ? 1 : 0) - (statusOf(b.slug) !== "later" ? 1 : 0),
      ),
    [regions],
  );
  const lifted = [sel, hover !== sel ? hover : null]
    .map((slug) => regions.find((r) => r.slug === slug))
    .filter((r): r is Region => !!r);
  const nzi = regions.find((r) => r.slug === "nzi");
  const nawa = regions.find((r) => r.slug === "nawa");
  const counts = { active: 0, upcoming: 0, later: 0 };
  regions.forEach((r) => counts[statusOf(r.slug)]++);
  const hovered = regions.find((r) => r.slug === hover);
  const panel = sel ? info(sel, regions.find((r) => r.slug === sel)?.name ?? "") : null;

  return (
    <div
      ref={rootRef}
      className={cn("afam", full ? "afam--full" : "afam--teaser", className)}
      onPointerMove={onPointerMove}
      onPointerLeave={onLeave}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onKeyDown={onKey}
      role={full ? "region" : undefined}
      aria-label={full ? "Carte interactive des implantations de l'ONG AFA en Côte d'Ivoire" : undefined}
      style={{ ["--z" as string]: 1 } as CSSProperties}
    >
      <div className="afam-stage" aria-hidden="true">
        <div ref={tiltRef} className="afam-tilt">
          {data && (
            <svg ref={svgRef} viewBox={data.viewBox} className="afam-svg" role="presentation">
              <defs>
                <pattern
                  id="afam-hatch"
                  width="10"
                  height="10"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="10" height="10" fill="#b5651f" />
                  <line x1="0" y1="0" x2="0" y2="10" stroke="#df8433" strokeWidth="6" />
                </pattern>
                <radialGradient id="afam-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0" stopColor="#59883c" stopOpacity=".35" />
                  <stop offset="1" stopColor="#59883c" stopOpacity="0" />
                </radialGradient>
              </defs>
              <ellipse cx="520" cy="560" rx="560" ry="520" fill="url(#afam-glow)" />
              {/* Épaisseur : deux copies décalées sous la carte */}
              <g transform="translate(0 16)" fill="#090c07">
                {regions.map((r) => (
                  <path key={r.slug} d={r.d} />
                ))}
              </g>
              <g transform="translate(0 8)" fill="#1a2614">
                {regions.map((r) => (
                  <path key={r.slug} d={r.d} />
                ))}
              </g>
              <g>
                {order.map((r) => {
                  const st = statusOf(r.slug);
                  return (
                    <path
                      key={r.slug}
                      ref={(el) => {
                        if (el) pathRefs.current.set(r.slug, el);
                      }}
                      d={r.d}
                      data-status={st}
                      className="afam-r"
                      onPointerEnter={() => setHover(r.slug)}
                      onClick={() => {
                        if (drag.current && drag.current.moved > 4) return;
                        select(r.slug === sel ? null : r.slug);
                      }}
                    />
                  );
                })}
              </g>
              {/* Copies surélevées de la région survolée et de la région choisie (sans capter le pointeur) */}
              <g pointerEvents="none">
                {lifted.map((r) => (
                  <path
                    key={`lift-${r.slug}`}
                    d={r.d}
                    data-status={statusOf(r.slug)}
                    className={cn("afam-r", r.slug === sel ? "is-sel" : "is-hov")}
                  />
                ))}
              </g>
              {nzi && nawa && (
                <path
                  className="afam-thread"
                  d={`M${nzi.label[0]},${nzi.label[1]} Q${(nzi.label[0] + nawa.label[0]) / 2},${Math.min(nzi.label[1], nawa.label[1]) - 150} ${nawa.label[0]},${nawa.label[1]}`}
                />
              )}
              {full &&
                regions
                  .filter((r) => statusOf(r.slug) === "later")
                  .map((r) => (
                    <text key={r.slug} x={r.label[0]} y={r.label[1]} className="afam-name">
                      {r.name}
                    </text>
                  ))}
              {nzi && (
                <g transform={`translate(${nzi.label[0]} ${nzi.label[1]})`} className="afam-mark">
                  <circle className="afam-breath" r="16" />
                  <circle r="7" fill="#a9c98f" stroke="#141a10" strokeWidth="2.5" />
                  <g className="afam-chip" transform="translate(0 -26)">
                    <rect x="-46" y="-30" width="92" height="30" rx="15" fill="#141a10" stroke="#a9c98f" />
                    <text y="-10" textAnchor="middle" fill="#fff">
                      N&apos;Zi
                    </text>
                  </g>
                </g>
              )}
              {nawa && (
                <g transform={`translate(${nawa.label[0]} ${nawa.label[1]})`} className="afam-mark">
                  <circle r="13" fill="none" stroke="#df8433" strokeWidth="2.5" strokeDasharray="4 3" />
                  <circle r="5" fill="#df8433" stroke="#141a10" strokeWidth="2" />
                  <g className="afam-chip" transform="translate(0 -26)">
                    <rect x="-50" y="-30" width="100" height="30" rx="15" fill="#141a10" stroke="#df8433" />
                    <text y="-10" textAnchor="middle" fill="#fff">
                      Nawa
                    </text>
                  </g>
                </g>
              )}
            </svg>
          )}
        </div>
      </div>

      {hovered && tip && !dragging && (
        <div
          className="afam-tip"
          style={{ transform: `translate(${tip.x + 16}px, ${tip.y + 18}px)` }}
          aria-hidden="true"
        >
          <StatusShape status={statusOf(hovered.slug)} size={12} />
          <b>{hovered.name}</b>
          <em>{full ? statusLabel[statusOf(hovered.slug)] : "Explorer →"}</em>
        </div>
      )}

      {full && data && (
        <>
          <ul className="afam-sr" aria-label="Régions de Côte d'Ivoire">
            {regions.map((r) => (
              <li key={r.slug}>
                <button
                  type="button"
                  onClick={() => {
                    focusPanel.current = true;
                    select(r.slug);
                  }}
                  aria-pressed={sel === r.slug}
                >
                  {r.name} : {statusLabel[statusOf(r.slug)]}
                </button>
              </li>
            ))}
          </ul>

          {panel && (
            <div className="afam-panel" aria-live="polite" key={sel}>
              <button type="button" className="afam-x" aria-label="Fermer" onClick={() => select(null)}>
                ×
              </button>
              <span
                className="afam-eb"
                style={{
                  color:
                    panel.status === "active"
                      ? "#a9c98f"
                      : panel.status === "upcoming"
                        ? "#df8433"
                        : "rgba(247,242,232,.75)",
                }}
              >
                {panel.eyebrow}
              </span>
              <h3 className="afam-nm" ref={panelTitle} tabIndex={-1}>
                {panel.name}
              </h3>
              <span className="afam-st">
                <StatusShape status={panel.status} />
                {statusLabel[panel.status]}
              </span>
              <p className="afam-tx">{panel.text}</p>
              {"note" in panel && panel.note && <p className="hand text-[30px] text-accent">{panel.note}</p>}
              {panel.cta.href.startsWith("#") ? (
                <a className="afam-cta" href={panel.cta.href}>
                  {panel.cta.label} →
                </a>
              ) : (
                <Link className="afam-cta" href={panel.cta.href}>
                  {panel.cta.label} →
                </Link>
              )}
            </div>
          )}

          <div className="afam-hud">
            <div className="flex flex-col gap-2.5">
              <p className="afam-count">
                {counts.active} région implantée · {counts.upcoming} prochaine étape · {regions.length}{" "}
                régions
              </p>
              <ul className="afam-leg" aria-label="Légende">
                {(["active", "upcoming", "later"] as const).map((s) => (
                  <li key={s}>
                    <StatusShape status={s} />
                    {statusLabel[s]}
                  </li>
                ))}
              </ul>
              {data && <p className="afam-src">Fond : {data.source}</p>}
            </div>
            <div className="afam-ctl" role="group" aria-label="Contrôles de la carte">
              <button type="button" onClick={() => zoomBy(0.7)} aria-label="Zoomer">
                +
              </button>
              <button type="button" onClick={() => zoomBy(1.4)} aria-label="Dézoomer">
                −
              </button>
              <button type="button" className="w" onClick={() => select(null)}>
                Vue nationale
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
