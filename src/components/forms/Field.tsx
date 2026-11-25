import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Enveloppe de champ : libellé visible, aide, erreur reliée au champ (aria-describedby).
 * L'enfant reçoit les identifiants via la fonction de rendu. `id` est explicite (stable, côté serveur).
 */
export function Field({
  id,
  label,
  hint,
  error,
  required,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  optional?: boolean;
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode;
  className?: string;
}) {
  const hintId = hint ? `${id}-aide` : undefined;
  const errorId = error ? `${id}-erreur` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;
  return (
    <div className={cn("space-y-1.5", className)}>
      <label htmlFor={id} className="block font-semibold text-ink">
        {label}
        {required && <span className="text-danger"> *</span>}
        {optional && <span className="font-normal text-ink-soft"> (facultatif)</span>}
      </label>
      {hint && (
        <p id={hintId} className="text-meta text-ink-soft">
          {hint}
        </p>
      )}
      {children({ id, describedBy, invalid: Boolean(error) })}
      {error && (
        <p id={errorId} className="text-meta font-semibold text-danger">
          {error}
        </p>
      )}
    </div>
  );
}

export const fieldClasses =
  "block w-full min-h-12 rounded-field border-2 border-field bg-white px-3 py-2 text-body text-ink " +
  "placeholder:text-ink-soft/70 focus:border-forest aria-invalid:border-danger disabled:bg-sand";
