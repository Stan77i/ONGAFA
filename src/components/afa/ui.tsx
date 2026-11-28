import { Rature } from "@/components/brand/Rature";
import Link from "next/link";
import type { ComponentProps, CSSProperties, ReactNode } from "react";
import { results } from "@/content/afa";
import { cn } from "@/lib/cn";

/* ───────── Panneaux ───────── */

export type PanelTone = "sand" | "cream" | "forest" | "orange" | "green" | "night" | "white";

const panelTones: Record<PanelTone, string> = {
  sand: "bg-sand text-ink",
  cream: "bg-cream text-ink",
  white: "bg-white text-ink",
  forest: "on-dark bg-forest text-sand",
  green: "on-dark bg-afa text-sand",
  night: "on-dark bg-night text-sand",
  orange: "on-orange bg-accent text-ink",
};

export const isDark = (t: PanelTone) => t === "forest" || t === "green" || t === "night";

/**
 * Section de page : une feuille arrondie (28 px) posée dans un cadre sur le fond encre.
 * `bare` retire le rembourrage intérieur (contenu pleine largeur : carte, hero).
 */
export function Panel({
  tone = "sand",
  id,
  labelledBy,
  label,
  className,
  frameClassName,
  bare = false,
  as: Tag = "section",
  style,
  children,
}: {
  tone?: PanelTone;
  id?: string;
  labelledBy?: string;
  label?: string;
  className?: string;
  frameClassName?: string;
  bare?: boolean;
  as?: "section" | "div" | "footer" | "header";
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <Tag
      id={id}
      aria-labelledby={labelledBy}
      aria-label={label}
      className={cn("panel-frame scroll-mt-4", frameClassName)}
    >
      <div
        className={cn(
          bare ? "relative rounded-[22px] sm:rounded-[28px]" : "panel",
          panelTones[tone],
          className,
        )}
        data-tone={tone}
        style={style}
      >
        {children}
      </div>
    </Tag>
  );
}

/* ───────── Titres ───────── */

export function Eyebrow({
  tone = "sand",
  className,
  children,
}: {
  tone?: PanelTone;
  className?: string;
  children: ReactNode;
}) {
  return (
    <p
      className={cn(
        "eyebrow",
        isDark(tone) ? "text-mint" : tone === "orange" ? "text-ink" : "text-accent-text",
        className,
      )}
    >
      {children}
    </p>
  );
}

export function SectionHead({
  id,
  eyebrow,
  title,
  intro,
  action,
  tone = "sand",
  className,
  maxWidth = "820px",
}: {
  id?: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  tone?: PanelTone;
  className?: string;
  maxWidth?: string;
}) {
  const dark = isDark(tone);
  const head = (
    <div className="flex flex-col gap-3.5" style={{ maxWidth }}>
      {eyebrow && <Eyebrow tone={tone}>{eyebrow}</Eyebrow>}
      <h2 id={id} className={cn("h-section", dark && "text-white")}>
        {title}
      </h2>
      <Rature
        className="-mt-1"
        color={
          dark ? "var(--color-leaf-light)" : tone === "orange" ? "var(--color-ink)" : "var(--color-leaf)"
        }
      />
      {intro && (
        <div
          className={cn(
            "max-w-[62ch] text-[17px] leading-[1.55] sm:text-[18px]",
            dark ? "text-sand" : tone === "orange" ? "font-medium text-ink" : "text-ink-soft",
          )}
        >
          {intro}
        </div>
      )}
    </div>
  );
  return (
    <div className={cn("mb-[clamp(28px,3.5vw,48px)]", className)}>
      {action ? (
        <div className="flex flex-wrap items-end justify-between gap-6">
          {head}
          {action}
        </div>
      ) : (
        head
      )}
    </div>
  );
}

/* ───────── Boutons pilule ───────── */

type PillVariant = "outline" | "outline-light" | "ink" | "orange" | "cream";
type PillSize = "sm" | "md" | "lg" | "xl";

const pillVariants: Record<PillVariant, string> = {
  outline: "border-[1.5px] border-ink text-ink hover:bg-ink hover:text-sand",
  "outline-light": "border-[1.5px] border-sand/70 text-sand hover:bg-sand hover:text-ink",
  ink: "bg-ink text-sand hover:bg-forest",
  orange: "border-[1.5px] border-ink bg-accent text-ink hover:bg-accent-hover",
  cream: "border-[1.5px] border-ink bg-sand text-ink hover:bg-white",
};
const pillSizes: Record<PillSize, string> = {
  sm: "min-h-11 px-[18px] text-[15px] font-bold",
  md: "min-h-[52px] px-[26px] text-[15px] font-bold sm:text-base",
  lg: "min-h-[60px] px-7 text-[17px] font-extrabold",
  xl: "min-h-[64px] px-8 text-[18px] font-extrabold sm:min-h-[68px] sm:text-[19px]",
};

export function pillClass(variant: PillVariant = "outline", size: PillSize = "md", className?: string) {
  return cn(
    "inline-flex items-center justify-center gap-3 rounded-full whitespace-nowrap transition-colors duration-200",
    pillVariants[variant],
    pillSizes[size],
    className,
  );
}

export function PillLink({
  variant,
  size,
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: PillVariant; size?: PillSize }) {
  return <Link {...props} data-magnetic="" className={pillClass(variant, size, className)} />;
}

/* ───────── Fil d'Ariane (dans les en-têtes colorés) ───────── */

export function Crumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Fil d'Ariane">
      <ol className="flex flex-wrap items-center gap-2 text-[13px] font-bold tracking-[0.08em] uppercase">
        {items.map((c, i) => (
          <li key={c.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden="true">/</span>}
            {c.href ? (
              <Link
                href={c.href}
                className="inline-flex min-h-6 items-center underline underline-offset-2 hover:no-underline"
              >
                {c.label}
              </Link>
            ) : (
              <span aria-current="page">{c.label}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* ───────── Papier ligné au bic ───────── */

export function Notebook({
  children,
  rotate = -4,
  className,
  margin = 40,
  float = false,
  textClassName,
}: {
  children: ReactNode;
  rotate?: number;
  className?: string;
  margin?: number;
  float?: boolean;
  textClassName?: string;
}) {
  return (
    <div className={cn(float && "anim-float", "w-fit max-w-full")}>
      <div
        className={cn("notebook", className)}
        style={{ transform: `rotate(${rotate}deg)`, ["--margin" as string]: `${margin}px` }}
      >
        <span className={cn("hand block", textClassName)}>{children}</span>
      </div>
    </div>
  );
}

/* ───────── Source d'un chiffre ───────── */

export function Declared({ className }: { className?: string }) {
  return (
    <p className={cn("text-[13px]", className)}>
      {results.period} · Source : {results.source}
    </p>
  );
}

/* ───────── Pastilles « Sur cette page » ───────── */

export function AnchorPills({ items, light = false }: { items: [string, string][]; light?: boolean }) {
  return (
    <nav aria-label="Sur cette page" className="flex flex-wrap gap-2">
      {items.map(([href, label]) => (
        <a
          key={href}
          href={href}
          className={cn(
            "inline-flex min-h-11 items-center rounded-full border-[1.5px] px-[18px] text-[15px] font-bold whitespace-nowrap transition-colors duration-200",
            light
              ? "border-sand text-sand hover:bg-sand hover:text-afa"
              : "border-ink hover:bg-ink hover:text-sand",
          )}
        >
          {label}
        </a>
      ))}
    </nav>
  );
}

/* ───────── Bandeau d'appel en fin de page ───────── */

export function CtaBand({
  tone = "orange",
  title,
  note,
  href,
  label,
  id,
}: {
  tone?: "orange" | "forest";
  title: ReactNode;
  note?: ReactNode;
  href: string;
  label: string;
  id: string;
}) {
  const dark = tone === "forest";
  return (
    <Panel
      tone={tone}
      labelledBy={id}
      className="flex flex-wrap items-center justify-between gap-6 py-[clamp(28px,4vw,56px)]"
    >
      <div className="flex flex-col gap-2">
        <h2
          id={id}
          className={cn(
            "m-0 max-w-[20ch] text-[clamp(30px,3.6vw,56px)] leading-none font-extrabold tracking-[-0.03em]",
            dark && "text-white",
          )}
        >
          {title}
        </h2>
        {note && <p className={cn("hand text-[40px]", dark ? "text-mint" : "text-pen")}>{note}</p>}
      </div>
      <PillLink href={href} variant={dark ? "orange" : "ink"} size="xl">
        {label}
        <svg width="22" height="14" viewBox="0 0 22 14" aria-hidden="true">
          <path
            d="M1 7 H20 M14 1 L20 7 L14 13"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </PillLink>
    </Panel>
  );
}
