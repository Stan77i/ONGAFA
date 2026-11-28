import Link from "next/link";
import type { ReactNode } from "react";
import { Crumbs } from "@/components/afa/ui";
import { cn } from "@/lib/cn";
import { HeroPanel } from "./HeroPanel";

const tabs = [
  { href: "/veille", label: "Veille du vivrier" },
  { href: "/prix", label: "Prix du vivrier" },
  { href: "/ressources", label: "Ressources" },
] as const;

/** Journal du vivrier, « daté et sourcé » (illustration de l'en-tête). */
function NewspaperArt() {
  const ink = "#1d2417";
  const line = { fill: "none", stroke: ink, strokeWidth: 2, strokeLinecap: "round" } as const;
  return (
    <svg viewBox="0 0 470 470" className="size-full overflow-visible" aria-hidden="true">
      <defs>
        <filter id="vp-sh">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor={ink} floodOpacity="0.22" />
        </filter>
      </defs>
      <g filter="url(#vp-sh)">
        <g transform="translate(150 60) rotate(8)">
          <rect width="300" height="360" rx="6" fill="#df8433" stroke={ink} strokeWidth="2" />
          <path d="M30 60 H270 M30 90 H230 M30 120 H250" {...line} />
        </g>
        <g transform="translate(40 70) rotate(-5)">
          <rect width="300" height="360" rx="6" fill="#fff" stroke={ink} strokeWidth="2" />
          <rect x="24" y="24" width="252" height="18" rx="3" fill={ink} />
          <text
            x="24"
            y="92"
            fill={ink}
            style={{ font: "800 34px var(--font-archivo)", letterSpacing: "-1px" }}
          >
            VEILLE
          </text>
          <text
            x="24"
            y="126"
            fill={ink}
            style={{ font: "800 34px var(--font-archivo)", letterSpacing: "-1px" }}
          >
            DU VIVRIER
          </text>
          <rect x="24" y="146" width="120" height="92" rx="4" fill="#4a7230" stroke={ink} strokeWidth="2" />
          <path
            d="M160 156 H276 M160 176 H262 M160 196 H272 M160 216 H240 M24 262 H276 M24 282 H250 M24 302 H268 M24 322 H200"
            {...line}
            strokeWidth={3}
            opacity={0.35}
          />
        </g>
      </g>
      <g transform="translate(300 330) rotate(-10)">
        <rect width="150" height="74" rx="3" fill="#fbf7ee" filter="url(#vp-sh)" />
        <text x="16" y="50" fill="#1f3f9e" style={{ font: "400 40px var(--font-reenie)" }}>
          daté &amp; sourcé
        </text>
      </g>
    </svg>
  );
}

/**
 * En-tête commun aux pages Veille, Prix et Ressources (panneau sable, journal illustré).
 * Les pastilles passent d'une page à l'autre ; la page courante est signalée.
 */
export function VivrierHero({
  current,
  crumb,
  title,
  intro,
  art,
}: {
  current: (typeof tabs)[number]["href"];
  crumb: string;
  title: ReactNode;
  intro: ReactNode;
  /** Illustration de droite (par défaut : le journal). La veille y pose son carrefour. */
  art?: ReactNode;
}) {
  return (
    <HeroPanel tone="cream" current={current}>
      <div className="grid items-center gap-[clamp(28px,4vw,64px)] lg:grid-cols-2">
        <div className="flex flex-col gap-[22px]">
          <Crumbs items={[{ href: "/", label: "Accueil" }, { label: crumb }]} />
          <h1 className="ink-title text-[clamp(64px,10vw,190px)] leading-[0.92]">{title}</h1>
          <p className="max-w-[56ch] text-[17px] leading-[1.55] font-medium sm:text-[18px]">{intro}</p>
          <nav aria-label="Rubriques du vivrier" className="flex flex-wrap gap-2">
            {tabs.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                aria-current={t.href === current ? "page" : undefined}
                className={cn(
                  "inline-flex min-h-11 items-center rounded-full border-[1.5px] border-ink px-[18px] text-[15px] font-bold whitespace-nowrap transition-colors duration-200",
                  t.href === current ? "bg-ink text-sand" : "hover:bg-ink hover:text-sand",
                )}
              >
                {t.label}
              </Link>
            ))}
          </nav>
        </div>
        {art ?? (
          <div className="relative aspect-square w-full max-w-[min(470px,80vw)] justify-self-center max-lg:max-w-[320px]">
            <NewspaperArt />
          </div>
        )}
      </div>
    </HeroPanel>
  );
}
