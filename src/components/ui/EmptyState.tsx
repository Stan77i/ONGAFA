import Image from "next/image";
import type { ReactNode } from "react";
import { site } from "@/config/site";
import { cn } from "@/lib/cn";

/** État vide explicite : dit ce qui manque et propose une action, sans jamais simuler de contenu. */
export function EmptyState({
  title,
  children,
  action,
  className,
}: {
  title: string;
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 rounded-card border-2 border-dashed border-rule bg-sand px-6 py-10 text-center",
        className,
      )}
    >
      <Image src={site.logos.symbol} alt="" width={56} height={56} className="opacity-70" />
      <p className="font-display text-h3 text-forest">{title}</p>
      {children && <div className="max-w-prose text-ink-soft">{children}</div>}
      {action}
    </div>
  );
}
