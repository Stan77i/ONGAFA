import type { ComponentProps } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/cn";
import { fieldClasses } from "./Field";

/* Taille de police ≥ 16 px : empêche le zoom automatique sur iPhone. */

export function Input({ className, ...props }: ComponentProps<"input">) {
  return <input {...props} className={cn(fieldClasses, className)} />;
}

export function Textarea({ className, rows = 5, ...props }: ComponentProps<"textarea">) {
  return <textarea rows={rows} {...props} className={cn(fieldClasses, "min-h-32 resize-y", className)} />;
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select {...props} className={cn(fieldClasses, "appearance-none pr-10", className)}>
        {children}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-3 size-5 -translate-y-1/2 text-ink-soft"
        aria-hidden="true"
      />
    </div>
  );
}

/** Case à cocher avec grande zone tactile. */
export function Checkbox({
  label,
  className,
  ...props
}: ComponentProps<"input"> & { label: React.ReactNode }) {
  return (
    <label className={cn("flex min-h-12 cursor-pointer items-start gap-3 py-2", className)}>
      <input type="checkbox" {...props} className="mt-0.5 size-6 shrink-0 accent-afa" />
      <span className="text-ink">{label}</span>
    </label>
  );
}

/**
 * Choix multiples ou uniques en grandes pastilles (cultures, besoins…),
 * plus rapides au doigt qu'une liste déroulante. Ce sont de vraies cases/boutons radio, accessibles au clavier.
 */
export function ChoiceChips({
  legend,
  name,
  options,
  type = "checkbox",
  defaultValue = [],
  hint,
}: {
  legend: string;
  name: string;
  options: { value: string; label: string }[];
  type?: "checkbox" | "radio";
  defaultValue?: string[];
  hint?: string;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="font-semibold text-ink">{legend}</legend>
      {hint && <p className="text-meta text-ink-soft">{hint}</p>}
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label key={o.value} className="cursor-pointer">
            <input
              type={type}
              name={name}
              value={o.value}
              defaultChecked={defaultValue.includes(o.value)}
              className="peer sr-only"
            />
            <span
              className={cn(
                "inline-flex min-h-12 items-center rounded-full border-2 border-field bg-white px-4 font-semibold text-ink transition-colors",
                "peer-checked:border-afa peer-checked:bg-afa peer-checked:text-white",
                "peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-forest",
              )}
            >
              {o.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
