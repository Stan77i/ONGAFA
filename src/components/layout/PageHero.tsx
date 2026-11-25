import type { ReactNode } from "react";
import { Breadcrumb, type Crumb } from "@/components/ui/Breadcrumb";
import { Container } from "./Section";

/** En-tête des pages intérieures : fil d'Ariane, surtitre, titre, accroche. */
export function PageHero({
  crumbs,
  eyebrow,
  title,
  intro,
  children,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-rule bg-cream">
      <Container className="space-y-5 py-8 sm:py-14">
        <Breadcrumb items={crumbs} />
        {eyebrow && (
          <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">{eyebrow}</p>
        )}
        <h1 className="max-w-4xl font-display text-h1 font-semibold text-forest">{title}</h1>
        {intro && <div className="max-w-2xl text-body text-ink-soft">{intro}</div>}
        {children}
      </Container>
    </header>
  );
}
