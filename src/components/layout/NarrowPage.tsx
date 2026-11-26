import type { ReactNode } from "react";
import { Container } from "./Section";

/** Page étroite (formulaires de compte) : lisible et confortable au téléphone. */
export function NarrowPage({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="bg-sand py-10 sm:py-16">
      <Container className="max-w-xl">
        <div className="space-y-6 rounded-card bg-white p-5 text-ink ring-1 ring-rule sm:p-8">
          <header className="space-y-2">
            {eyebrow && (
              <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
                {eyebrow}
              </p>
            )}
            <h1 className="font-display text-h2 font-semibold text-forest">{title}</h1>
            {intro && <div className="text-ink-soft">{intro}</div>}
          </header>
          {children}
        </div>
      </Container>
    </div>
  );
}
