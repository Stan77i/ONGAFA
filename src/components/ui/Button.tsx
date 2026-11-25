import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Spinner } from "./Spinner";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "on-dark";
type Size = "md" | "lg";

const base =
  "inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-semibold leading-tight " +
  "transition-[background-color,color,box-shadow,transform] duration-150 active:translate-y-px " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50";

const variants: Record<Variant, string> = {
  // Texte blanc sur vert AFA : 5,6:1
  primary: "bg-afa text-white hover:bg-forest",
  // Texte encre sur orange : 5,7:1 (jamais de texte blanc sur l'orange)
  accent: "bg-accent text-ink hover:bg-accent-hover",
  secondary: "border-2 border-afa text-afa hover:bg-afa hover:text-white",
  ghost: "text-afa underline-offset-4 hover:underline",
  danger: "bg-danger text-white hover:bg-[#8f1e18]",
  "on-dark": "bg-sand text-forest hover:bg-white",
};

const sizes: Record<Size, string> = {
  md: "text-base",
  lg: "min-h-14 px-8 text-lg",
};

type Common = {
  variant?: Variant;
  size?: Size;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  className?: string;
  children: ReactNode;
};
type AsButton = Omit<ComponentProps<"button">, "className" | "children"> & {
  href?: undefined;
  loading?: boolean;
};
type AsLink = Omit<ComponentProps<typeof Link>, "className" | "children"> & { href: string };

/** Bouton ou lien-bouton (si `href`). Zone tactile ≥ 48 px. */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  className,
  children,
  ...rest
}: Common & (AsButton | AsLink)) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (typeof rest.href === "string") {
    return (
      <Link {...(rest as AsLink)} className={classes}>
        {icon}
        {children}
        {iconAfter}
      </Link>
    );
  }

  const { loading, disabled, type = "button", ...buttonProps } = rest as AsButton;
  return (
    <button
      {...buttonProps}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={classes}
    >
      {loading ? <Spinner className="size-5" label="Envoi en cours" /> : icon}
      {children}
      {iconAfter}
    </button>
  );
}
