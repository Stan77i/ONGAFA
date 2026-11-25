import { cn } from "@/lib/cn";

export function Spinner({ className, label = "Chargement" }: { className?: string; label?: string }) {
  return (
    <span role="status" className={cn("inline-block", className)}>
      <svg viewBox="0 0 24 24" className="size-full motion-safe:animate-spin" aria-hidden="true">
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          stroke="currentColor"
          strokeOpacity="0.25"
          strokeWidth="3"
        />
        <path
          d="M21 12a9 9 0 0 0-9-9"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
      <span className="sr-only">{label}</span>
    </span>
  );
}
