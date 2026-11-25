import { CircleCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Retour visuel après une action (« Publication envoyée »).
 * Placer dans une zone aria-live ; l'affichage/masquage est géré par la page appelante.
 */
export function Toast({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      role="status"
      className={cn(
        "flex items-center gap-3 rounded-card bg-forest px-4 py-3 font-semibold text-white shadow-raised",
        className,
      )}
    >
      <CircleCheck className="size-5 shrink-0 text-leaf-light" aria-hidden="true" />
      {children}
    </div>
  );
}
