import { Factory, GraduationCap, HandCoins, Landmark, Sprout, Truck, Users, Wheat } from "lucide-react";
import { cn } from "@/lib/cn";

const icons = {
  sprout: Sprout,
  wheat: Wheat,
  factory: Factory,
  "hand-coins": HandCoins,
  "graduation-cap": GraduationCap,
  users: Users,
  truck: Truck,
  landmark: Landmark,
} as const;

export type DomainIconName = keyof typeof icons;

/** Pastille d'icône des domaines d'action (utilisée tant que les photos ne sont pas fournies). */
export function DomainIcon({ name, className }: { name: DomainIconName; className?: string }) {
  const Icon = icons[name];
  return (
    <span
      className={cn(
        "grid size-14 shrink-0 place-items-center rounded-full bg-leaf/12 text-afa ring-1 ring-leaf/25",
        className,
      )}
    >
      <Icon className="size-7" aria-hidden="true" strokeWidth={1.8} />
    </span>
  );
}
