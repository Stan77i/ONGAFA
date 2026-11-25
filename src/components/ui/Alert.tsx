import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type Tone = "info" | "success" | "warning" | "error";

const config: Record<Tone, { icon: typeof Info; classes: string }> = {
  info: { icon: Info, classes: "border-forest bg-sand" },
  success: { icon: CircleCheck, classes: "border-afa bg-leaf/10" },
  warning: { icon: TriangleAlert, classes: "border-harvest bg-harvest/15" },
  error: { icon: CircleAlert, classes: "border-danger bg-danger/8" },
};

/** Message contextuel. Les erreurs sont annoncées immédiatement aux lecteurs d'écran. */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const { icon: Icon, classes } = config[tone];
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-card border-l-4 p-4 text-ink", classes, className)}
    >
      <Icon
        className={cn("mt-0.5 size-5 shrink-0", tone === "error" ? "text-danger" : "text-forest")}
        aria-hidden="true"
      />
      <div className="space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-ink-soft [&_a]:font-semibold [&_a]:text-afa [&_a]:underline">{children}</div>
      </div>
    </div>
  );
}
