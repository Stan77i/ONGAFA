import { cn } from "@/lib/cn";

/** Bloc de chargement. Animation désactivée si l'utilisateur réduit les mouvements. */
export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("skeleton rounded-field", className)} />;
}

export function CardSkeleton() {
  return (
    <div
      className="space-y-3 rounded-card bg-white text-ink p-4 ring-1 ring-rule"
      aria-busy="true"
      aria-label="Chargement"
    >
      <Skeleton className="aspect-[16/10] w-full rounded-card" />
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-6 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}
