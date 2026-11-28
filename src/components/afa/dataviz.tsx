import regionsData from "@/data/ci-regions.json";
import type { NewsEntry } from "@/lib/content/data";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/cn";

/* Visualisations inspirées des tableaux de bord (barres pilules, colonnes « pouls », anneau),
   toujours calculées à partir de données réelles. */

const statusOf = (slug: string) => (slug === "nzi" ? "active" : slug === "nawa" ? "upcoming" : "later");

/** Barre pilule du déploiement : régions implantées, prochaine étape, à venir (tracés de la carte). */
export function DeploymentBar({ dark = false, className }: { dark?: boolean; className?: string }) {
  const n = { active: 0, upcoming: 0, later: 0 };
  regionsData.regions.forEach((r) => n[statusOf(r.slug)]++);
  const total = regionsData.regions.length;
  const seg = [
    { k: "active", label: "Implantée", v: n.active, cls: "bg-afa text-white border-ink" },
    {
      k: "upcoming",
      label: "Prochaine étape",
      v: n.upcoming,
      cls: "text-ink border-ink bg-[repeating-linear-gradient(45deg,#df8433_0_6px,#eb9652_6px_12px)]",
    },
    {
      k: "later",
      label: "À venir",
      v: n.later,
      cls: dark ? "bg-sand/12 text-sand border-sand/30" : "bg-cream text-ink border-ink/25",
    },
  ];
  return (
    <figure className={cn("flex flex-col gap-2.5", className)}>
      <figcaption
        className={cn(
          "flex flex-wrap items-baseline justify-between gap-2 text-[13px] font-bold",
          dark ? "text-mint" : "text-ink-soft",
        )}
      >
        <span className="tracking-[0.12em] uppercase">Déploiement national</span>
        <span>
          {n.active} / {total} régions
        </span>
      </figcaption>
      <div
        className="flex h-12 gap-1.5"
        role="img"
        aria-label={`${n.active} région implantée, ${n.upcoming} prochaine étape, ${n.later} régions à venir, sur ${total}.`}
      >
        {seg.map((s) => (
          <span
            key={s.k}
            className={cn(
              "grid min-w-12 place-items-center rounded-full border-[1.5px] text-[15px] font-extrabold transition-[flex-grow] duration-700",
              s.cls,
            )}
            style={{ flexGrow: s.k === "later" ? s.v : Math.max(s.v, 1) * 3 }}
          >
            {s.v}
          </span>
        ))}
      </div>
      <ul
        className={cn(
          "flex flex-wrap gap-x-4 gap-y-1 text-[13px] font-semibold",
          dark ? "text-sand/80" : "text-ink-soft",
        )}
        aria-hidden="true"
      >
        {seg.map((s) => (
          <li key={s.k} className="flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-full border", s.cls)} />
            {s.label}
          </li>
        ))}
      </ul>
    </figure>
  );
}

/** Début de semaine (lundi, 00:00 UTC). */
function weekStart(d: Date) {
  const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = (x.getUTCDay() + 6) % 7;
  x.setUTCDate(x.getUTCDate() - day);
  return x;
}

/**
 * « Pouls » de la veille : informations publiées par semaine sur les 8 dernières semaines.
 * La semaine en cours (incomplète) est hachurée. Rien n'est affiché sans information.
 */
export function VeillePulse({ items, builtAt = new Date() }: { items: NewsEntry[]; builtAt?: Date }) {
  if (items.length === 0) return null;
  const now = weekStart(builtAt);
  const weeks = Array.from({ length: 8 }, (_, i) => {
    const d = new Date(now);
    d.setUTCDate(d.getUTCDate() - 7 * (7 - i));
    return { start: d, n: 0 };
  });
  for (const it of items) {
    const w = weekStart(new Date(it.publishedAt)).getTime();
    const slot = weeks.find((x) => x.start.getTime() === w);
    if (slot) slot.n++;
  }
  const max = Math.max(1, ...weeks.map((w) => w.n));
  const total = weeks.reduce((a, w) => a + w.n, 0);
  const latest = items.reduce((a, b) => (Date.parse(b.publishedAt) > Date.parse(a.publishedAt) ? b : a));
  const short = (d: Date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", timeZone: "UTC" }).format(d);

  return (
    <figure className="flex flex-col gap-5">
      <figcaption className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-mint">Le pouls de la veille</p>
          <p className="mt-1 text-[clamp(28px,3vw,40px)] leading-none font-extrabold tracking-[-0.03em] text-white">
            {total} <span className="text-[0.5em] font-bold text-sand/80">informations en 8 semaines</span>
          </p>
        </div>
        <p className="inline-flex items-center gap-2 rounded-full border-[1.5px] border-sand/30 px-4 py-2 text-[13px] font-bold">
          <span className="size-2 rounded-full bg-accent" aria-hidden="true" />
          Dernière information : <time dateTime={latest.publishedAt}>{formatDate(latest.publishedAt)}</time>
        </p>
      </figcaption>
      <ol
        className="grid h-[190px] grid-cols-8 items-end gap-[clamp(6px,1.4vw,18px)]"
        aria-label="Informations publiées par semaine"
      >
        {weeks.map((w, i) => {
          const current = i === weeks.length - 1;
          const h = Math.max(14, (w.n / max) * 100);
          return (
            <li key={w.start.toISOString()} className="flex h-full flex-col items-center justify-end gap-2">
              <span className="text-[12px] font-extrabold text-sand">{w.n}</span>
              <span
                className={cn(
                  "w-full max-w-16 rounded-full border-[1.5px] transition-[height] duration-700",
                  current
                    ? "border-accent bg-[repeating-linear-gradient(45deg,#df8433_0_5px,transparent_5px_10px)]"
                    : i % 2 === 0
                      ? "border-sand/20 bg-sand/85"
                      : "border-sand/20 bg-mint/70",
                )}
                style={{ height: `${h}%` }}
              />
              <span
                className={cn(
                  "text-[11.5px] font-bold whitespace-nowrap",
                  current ? "text-accent" : "text-sand/70",
                )}
              >
                {current ? "Cette sem." : short(w.start)}
                <span className="sr-only">
                  {" "}
                  : {w.n} information{w.n > 1 ? "s" : ""}
                </span>
              </span>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}

/** Anneau : répartition des usages du manioc par famille (src/content/afa.ts). */
export function UsesRing({ groups }: { groups: { group: string; count: number }[] }) {
  const colors = ["#df8433", "#4a7230", "#1d2417", "#a9c98f"];
  const total = groups.reduce((a, g) => a + g.count, 0);
  const R = 70;
  const C = 2 * Math.PI * R;
  const offsets = groups.map((_, i) => groups.slice(0, i).reduce((a, g) => a + (g.count / total) * C, 0));
  return (
    <figure className="flex flex-wrap items-center gap-6">
      <svg
        width="180"
        height="180"
        viewBox="0 0 180 180"
        role="img"
        aria-label={`${total} usages du manioc répartis en ${groups.length} familles`}
      >
        <circle cx="90" cy="90" r={R} fill="none" stroke="#efe6d2" strokeWidth="26" />
        {groups.map((g, i) => {
          const len = (g.count / total) * C;
          const el = (
            <circle
              key={g.group}
              cx="90"
              cy="90"
              r={R}
              fill="none"
              stroke={colors[i % colors.length]}
              strokeWidth="26"
              strokeDasharray={`${Math.max(0, len - 3)} ${C}`}
              strokeDashoffset={-offsets[i]}
              transform="rotate(-90 90 90)"
            />
          );
          return el;
        })}
        <circle cx="90" cy="90" r={R - 13} fill="none" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="90" cy="90" r={R + 13} fill="none" stroke="currentColor" strokeWidth="1.5" />
        <text
          x="90"
          y="88"
          textAnchor="middle"
          style={{ font: "400 38px var(--font-ink)" }}
          fill="currentColor"
        >
          {total}
        </text>
        <text
          x="90"
          y="110"
          textAnchor="middle"
          style={{ font: "700 12px var(--font-archivo)", letterSpacing: ".12em" }}
          fill="currentColor"
          opacity={0.75}
        >
          USAGES
        </text>
      </svg>
      <ul className="flex min-w-[200px] flex-col gap-2">
        {groups.map((g, i) => (
          <li
            key={g.group}
            className="flex items-center justify-between gap-6 rounded-full bg-white px-4 py-2 text-[15px] font-bold"
          >
            <span className="flex items-center gap-2">
              <span
                className="size-3 rounded-full border border-ink"
                style={{ background: colors[i % colors.length] }}
              />
              {g.group}
            </span>
            <span className="tabular-nums">{g.count}</span>
          </li>
        ))}
      </ul>
    </figure>
  );
}
