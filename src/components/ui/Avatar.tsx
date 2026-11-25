import Image from "next/image";
import { cn } from "@/lib/cn";
import { initials } from "@/lib/format";

/** Photo de profil, ou initiales sur fond vert par défaut. */
export function Avatar({
  name,
  src,
  size = 44,
  className,
}: {
  name: string;
  src?: string;
  size?: number;
  className?: string;
}) {
  return src ? (
    <Image
      src={src}
      alt=""
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-cover", className)}
    />
  ) : (
    <span
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn(
        "grid shrink-0 place-items-center rounded-full bg-afa font-semibold text-white",
        className,
      )}
    >
      {initials(name)}
    </span>
  );
}
