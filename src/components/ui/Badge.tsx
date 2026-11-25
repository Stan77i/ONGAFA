import { BadgeCheck, ExternalLink } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "neutral" | "category" | "crop" | "verified" | "external" | "warning" | "danger";

const tones: Record<Tone, string> = {
  neutral: "bg-sand text-ink-soft ring-1 ring-rule",
  category: "bg-white text-accent-text ring-1 ring-accent/40",
  crop: "bg-leaf/12 text-forest ring-1 ring-leaf/30",
  verified: "bg-afa text-white",
  external: "bg-cream text-ink-soft ring-1 ring-rule",
  warning: "bg-harvest/25 text-ink ring-1 ring-harvest",
  danger: "bg-danger/10 text-danger ring-1 ring-danger/30",
};

/** Étiquette courte. Le sens n'est jamais porté par la couleur seule : le texte suffit. */
export function Badge({
  tone = "neutral",
  children,
  className,
}: {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-meta font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}
    >
      {tone === "verified" && <BadgeCheck className="size-4" aria-hidden="true" />}
      {tone === "external" && <ExternalLink className="size-3.5" aria-hidden="true" />}
      {children}
    </span>
  );
}

export function VerifiedBadge() {
  return <Badge tone="verified">Vérifié par AFA</Badge>;
}

export function ExternalSourceBadge() {
  return <Badge tone="external">Source externe</Badge>;
}
