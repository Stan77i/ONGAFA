import { Avatar } from "@/components/ui/Avatar";
import { president } from "@/content/afa";

/** Présidente de l'ONG. Photo ajoutée dès qu'elle est fournie (avec accord). */
export function PresidentCard() {
  return (
    <figure className="flex flex-col items-start gap-5 rounded-card bg-white p-6 text-ink ring-1 ring-rule sm:flex-row sm:items-center">
      <Avatar name={president.name} src={president.photo ?? undefined} size={96} className="text-2xl" />
      <figcaption className="space-y-1">
        <p className="text-meta font-semibold tracking-[0.12em] text-accent-text uppercase">
          {president.role}
        </p>
        <p className="font-display text-h3 font-semibold text-forest">
          {president.title} {president.name}
        </p>
      </figcaption>
    </figure>
  );
}
