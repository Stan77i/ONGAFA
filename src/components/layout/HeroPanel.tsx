import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { SiteHeader } from "./SiteHeader";

export type HeroTone = "orange" | "green" | "night" | "cream";

export const heroTones: Record<HeroTone, { bg: string; fg: string; ring: string; join: "ink" | "orange" }> = {
  orange: { bg: "#df8433", fg: "#1d2417", ring: "rgba(29,36,23,.14)", join: "ink" },
  green: { bg: "#4a7230", fg: "#f7f2e8", ring: "rgba(247,242,232,.16)", join: "orange" },
  night: { bg: "#141a10", fg: "#f7f2e8", ring: "rgba(247,242,232,.16)", join: "orange" },
  cream: { bg: "#efe6d2", fg: "#1d2417", ring: "rgba(29,36,23,.1)", join: "ink" },
};

/**
 * Premier panneau des pages intérieures : en-tête du site + ouverture de la page.
 * `id="contenu"` marque le début du contenu (cible du lien d'évitement).
 */
export function HeroPanel({
  tone,
  current,
  children,
  className,
  contentClassName,
  background,
}: {
  tone: HeroTone;
  current: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  /** Calque décoratif plein cadre (carte, motifs), placé sous l'en-tête et le contenu. */
  background?: ReactNode;
}) {
  const t = heroTones[tone];
  const vars = { "--hbg": t.bg, "--hfg": t.fg, "--hring": t.ring } as CSSProperties;
  return (
    <div className="panel-frame">
      <div
        style={{ ...vars, background: t.bg, color: t.fg }}
        className={cn(
          "relative overflow-hidden rounded-[22px] p-[clamp(12px,2vw,26px)] pb-[clamp(28px,4vw,56px)] sm:rounded-[28px]",
          tone === "orange" && "on-orange",
          (tone === "green" || tone === "night") && "on-dark",
          className,
        )}
      >
        {background}
        <SiteHeader current={current} join={t.join} />
        <div
          id="contenu"
          tabIndex={-1}
          className={cn(
            "relative mt-[clamp(28px,5vw,72px)] px-[clamp(6px,2vw,38px)] outline-none",
            contentClassName,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
