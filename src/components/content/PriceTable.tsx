import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { formatDate, formatFcfa } from "@/lib/format";

export type PriceRow = {
  product: string;
  market: string;
  unit: string; // « kg », « sac de 50 kg », « tas »
  amount: number;
  observedOn: string;
  source: string;
  verified: boolean;
  trend?: "up" | "down" | "stable";
};

// Couleurs neutres volontairement : une hausse est bonne pour le producteur, mauvaise pour l'acheteur.
const trends = {
  up: { label: "En hausse", icon: ArrowUpRight, cls: "text-ink" },
  down: { label: "En baisse", icon: ArrowDownRight, cls: "text-ink" },
  stable: { label: "Stable", icon: ArrowRight, cls: "text-ink-soft" },
} as const;

function Trend({ trend }: { trend?: PriceRow["trend"] }) {
  if (!trend) return <span className="text-ink-soft">—</span>;
  const { label, icon: Icon, cls } = trends[trend];
  return (
    <span className={`inline-flex items-center gap-1 font-semibold ${cls}`}>
      <Icon className="size-4" aria-hidden="true" />
      {label}
    </span>
  );
}

/**
 * Prix du vivrier. Chaque ligne porte sa date, sa source et son statut de vérification :
 * un prix non daté ou non vérifié n'est jamais présenté comme actuel.
 * Tableau sur grand écran, cartes empilées sur mobile.
 */
export function PriceTable({ rows, caption }: { rows: PriceRow[]; caption: string }) {
  return (
    <div>
      {/* Mobile : cartes */}
      <ul className="space-y-3 md:hidden" aria-label={caption}>
        {rows.map((r) => (
          <li key={`${r.product}-${r.market}-${r.observedOn}`} className="sticker bg-sand p-4 text-ink">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{r.product}</p>
                <p className="text-meta text-ink-soft">
                  {r.market} · par {r.unit}
                </p>
              </div>
              <p className="text-right text-xl font-extrabold text-ink tabular-nums">
                {formatFcfa(r.amount)}
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-meta">
              <Trend trend={r.trend} />
              {!r.verified && <Badge tone="warning">Non vérifié</Badge>}
            </div>
            <p className="mt-2 text-meta text-ink-soft">
              Relevé du {formatDate(r.observedOn)} · {r.source}
            </p>
          </li>
        ))}
      </ul>

      {/* Tablette et ordinateur : tableau */}
      <div className="hidden overflow-x-auto rounded-[22px] border-[1.5px] border-ink shadow-[0_8px_0_#1d2417] md:block">
        <table className="w-full border-collapse bg-sand text-left">
          <caption className="sr-only">{caption}</caption>
          <thead className="bg-ink text-[13px] font-extrabold tracking-[0.08em] text-sand uppercase">
            <tr>
              <th scope="col" className="px-4 py-3">
                Produit
              </th>
              <th scope="col" className="px-4 py-3">
                Marché
              </th>
              <th scope="col" className="px-4 py-3 text-right">
                Prix
              </th>
              <th scope="col" className="px-4 py-3">
                Évolution
              </th>
              <th scope="col" className="px-4 py-3">
                Relevé
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={`${r.product}-${r.market}-${r.observedOn}`} className="border-t border-rule">
                <th scope="row" className="px-4 py-3 font-semibold">
                  {r.product}
                </th>
                <td className="px-4 py-3 text-ink-soft">{r.market}</td>
                <td className="px-4 py-3 text-right font-semibold tabular-nums">
                  {formatFcfa(r.amount)} <span className="font-normal text-ink-soft">/ {r.unit}</span>
                </td>
                <td className="px-4 py-3">
                  <Trend trend={r.trend} />
                </td>
                <td className="px-4 py-3 text-meta text-ink-soft">
                  {formatDate(r.observedOn)} · {r.source}
                  {!r.verified && (
                    <Badge tone="warning" className="ml-2">
                      Non vérifié
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
