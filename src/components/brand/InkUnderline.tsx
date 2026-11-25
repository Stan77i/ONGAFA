import { cn } from "@/lib/cn";

/**
 * Trait d'encre dessiné à la main, dans l'esprit du logo. À placer sous un mot-clé ou le slogan.
 * Le tracé se dessine à l'affichage (désactivé si l'utilisateur réduit les mouvements).
 */
export function InkUnderline({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg
      viewBox="0 0 300 16"
      preserveAspectRatio="none"
      className={cn("ink-draw block h-3 w-full", className)}
      aria-hidden="true"
    >
      <path
        d="M3 11.5c38-5.2 77-7.6 118-7.3 30 .2 57 2.4 86 3.1 30 .8 59-.6 90-3.6"
        fill="none"
        stroke={color}
        strokeWidth="3.2"
        strokeLinecap="round"
        pathLength={1}
      />
    </svg>
  );
}

/** Mot souligné d'un trait d'encre, utilisable dans un titre. */
export function InkMark({ children, color = "#df8433" }: { children: React.ReactNode; color?: string }) {
  return (
    <span className="relative inline-block whitespace-nowrap">
      {children}
      <InkUnderline className="absolute -bottom-2 left-0" color={color} />
    </span>
  );
}
