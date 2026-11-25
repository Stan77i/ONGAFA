import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "white" | "sand" | "cream" | "forest";

const tones: Record<Tone, string> = {
  white: "bg-white text-ink",
  sand: "bg-sand text-ink",
  cream: "bg-cream text-ink",
  forest: "on-dark bg-forest text-sand",
};

/** Largeur de contenu commune (1200 px max, marges 16 px sur mobile). */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-[75rem] px-4 sm:px-6 lg:px-8", className)}>{children}</div>;
}

/** Bande de page avec fond alterné et apparition progressive. */
export function Section({
  tone = "white",
  children,
  className,
  id,
  labelledBy,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
  id?: string;
  labelledBy?: string;
}) {
  return (
    <section id={id} aria-labelledby={labelledBy} className={cn("py-14 sm:py-20", tones[tone], className)}>
      <Container className="reveal">{children}</Container>
    </section>
  );
}

/** Titre de section : surtitre en petites capitales + titre en Fraunces + accroche optionnelle. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  action,
  onDark = false,
}: {
  id?: string;
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  action?: ReactNode;
  onDark?: boolean;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl space-y-3">
        {eyebrow && (
          <p
            className={cn(
              "text-meta font-semibold tracking-[0.12em] uppercase",
              onDark ? "text-leaf-light" : "text-accent-text",
            )}
          >
            {eyebrow}
          </p>
        )}
        <h2
          id={id}
          className={cn("font-display text-h2 font-semibold", onDark ? "text-white" : "text-forest")}
        >
          {title}
        </h2>
        {intro && <p className={cn("text-body", onDark ? "text-sand" : "text-ink-soft")}>{intro}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
