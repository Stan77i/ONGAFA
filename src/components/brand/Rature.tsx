import { cn } from "@/lib/cn";

/**
 * Double rature à la main, reprise du hero (sous le texte « ONG ivoirienne… »).
 * À placer sous un titre ou un bloc de texte. Couleur : `currentColor` par défaut.
 */
export function Rature({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      width="120"
      height="14"
      viewBox="0 0 120 14"
      aria-hidden="true"
      className={cn("block h-[14px] w-[120px] flex-none", className)}
    >
      <path
        d="M3 9 C30 3 70 4 116 6 M10 12 C40 8 70 9 96 10"
        fill="none"
        stroke={color}
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Bande de scotch translucide, reprise de la feuille « Je suis AFA » du hero.
 * Le parent doit être `relative` ; la bande se pose à cheval sur son bord haut.
 */
export function Tape({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute -top-3 left-1/2 z-[3] h-[26px] w-[92px] -translate-x-1/2 rotate-3 bg-white/60 shadow-[0_1px_2px_rgba(29,36,23,.15)] backdrop-blur-[1px]",
        className,
      )}
    />
  );
}
