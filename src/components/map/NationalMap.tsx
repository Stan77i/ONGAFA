import regionsData from "@/data/ci-regions.json";
import type { AfaMapPoint } from "@/lib/map/data";
import { statusLabels } from "./StatusPill";

type Region = (typeof regionsData.regions)[number];

const fills = {
  active: { fill: "#4a7230", stroke: "#1d2417", dash: undefined, label: "#ffffff" },
  in_progress: { fill: "#e9b44c", stroke: "#1d2417", dash: undefined, label: "#1d2417" },
  upcoming: { fill: "url(#afa-hachures)", stroke: "#1d2417", dash: "6 4", label: "#1d2417" },
} as const;

/**
 * Carte des régions de Côte d'Ivoire, dessinée côté serveur (SVG léger, sans fond de carte externe).
 * Les régions où AFA est présente sont colorées selon leur statut (couleur + motif + libellé).
 * `interactive` : les régions AFA deviennent focusables (gérées par NationalMapExplorer).
 */
export function NationalMap({
  points,
  interactive = false,
  className,
  title = "Carte des implantations de l'ONG AFA en Côte d'Ivoire",
}: {
  points: AfaMapPoint[];
  interactive?: boolean;
  className?: string;
  title?: string;
}) {
  const bySlug = new Map(points.map((p) => [p.slug, p]));
  const afaRegions = regionsData.regions.filter((r) => bySlug.has(r.slug));

  return (
    <svg viewBox={regionsData.viewBox} className={className} role="img" aria-labelledby="carte-titre">
      <title id="carte-titre">{title}</title>
      <defs>
        <pattern
          id="afa-hachures"
          width="10"
          height="10"
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <rect width="10" height="10" fill="#ffffff" />
          <line x1="0" y1="0" x2="0" y2="10" stroke="#e9b44c" strokeWidth="5" />
        </pattern>
      </defs>

      {/* Fond : toutes les régions */}
      <g fill="#f7f2e8" stroke="#b9b09c" strokeWidth="1.2" strokeLinejoin="round">
        {regionsData.regions.map((r: Region) => (bySlug.has(r.slug) ? null : <path key={r.slug} d={r.d} />))}
      </g>

      {/* Régions AFA, par-dessus */}
      {afaRegions.map((r) => {
        const p = bySlug.get(r.slug)!;
        const s = fills[p.status];
        const label = `${r.name} : ${statusLabels[p.status]}`;
        return (
          <path
            key={r.slug}
            d={r.d}
            data-slug={interactive ? r.slug : undefined}
            fill={s.fill}
            stroke={s.stroke}
            strokeWidth="2.5"
            strokeDasharray={s.dash}
            strokeLinejoin="round"
            className={interactive ? "afa-region cursor-pointer outline-none" : undefined}
            tabIndex={interactive ? 0 : undefined}
            role={interactive ? "button" : undefined}
            aria-label={interactive ? `${label}. Afficher la fiche.` : undefined}
          >
            {!interactive && <title>{label}</title>}
          </path>
        );
      })}

      {/* Étiquettes des régions AFA */}
      <g
        pointerEvents="none"
        fontFamily="var(--font-sans)"
        fontWeight="700"
        textAnchor="middle"
        aria-hidden="true"
      >
        {afaRegions.map((r) => {
          const p = bySlug.get(r.slug)!;
          const [x, y] = r.label;
          return (
            <text
              key={r.slug}
              x={x}
              y={y}
              fontSize="26"
              fill={fills[p.status].label}
              stroke={p.status === "active" ? "#2c4520" : "#ffffff"}
              strokeWidth="5"
              paintOrder="stroke"
            >
              {r.name}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

export const mapAttribution = regionsData.source;
