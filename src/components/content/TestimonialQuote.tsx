import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/format";

export type Testimonial = {
  quote: string;
  name: string;
  place: string;
  activity: string;
  date: string;
  photo?: string;
};

/** Témoignage validé (avec consentement). La citation est le premier élément visuel. */
export function TestimonialQuote({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="relative mx-auto max-w-3xl space-y-6">
      <span
        aria-hidden="true"
        className="absolute -top-6 -left-2 font-display text-8xl leading-none text-accent/40"
      >
        «
      </span>
      <blockquote className="relative font-display text-h2 leading-snug font-medium text-forest">
        <p>{testimonial.quote}</p>
      </blockquote>
      <figcaption className="flex items-center gap-4">
        <Avatar name={testimonial.name} src={testimonial.photo} size={56} />
        <div>
          <p className="font-semibold text-ink">{testimonial.name}</p>
          <p className="text-meta text-ink-soft">
            {testimonial.activity} · {testimonial.place} ·{" "}
            <time dateTime={testimonial.date}>{formatDate(testimonial.date)}</time>
          </p>
        </div>
      </figcaption>
    </figure>
  );
}
