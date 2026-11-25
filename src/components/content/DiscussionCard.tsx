import Link from "next/link";
import { MessageCircle, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

export type DiscussionSummary = {
  href: string;
  question: string;
  authorName: string;
  place?: string;
  crop?: string;
  replies: number;
  askedAt: string;
};

/** Question du forum : qui, où, quelle culture, combien de réponses. */
export function DiscussionCard({ discussion }: { discussion: DiscussionSummary }) {
  const replies =
    discussion.replies === 0
      ? "Pas encore de réponse"
      : `${discussion.replies} réponse${discussion.replies > 1 ? "s" : ""}`;
  return (
    <article className="group relative flex gap-3 rounded-card bg-white text-ink p-4 ring-1 ring-rule transition-shadow hover:shadow-raised">
      <Avatar name={discussion.authorName} />
      <div className="min-w-0 space-y-2">
        <h3 className="font-semibold text-ink">
          <Link
            href={discussion.href}
            className="after:absolute after:inset-0 after:rounded-card group-hover:underline"
          >
            {discussion.question}
          </Link>
        </h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-ink-soft">
          <span>{discussion.authorName}</span>
          {discussion.place && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {discussion.place}
            </span>
          )}
          {discussion.crop && <Badge tone="crop">{discussion.crop}</Badge>}
          <span className="flex items-center gap-1 font-semibold text-afa">
            <MessageCircle className="size-4" aria-hidden="true" />
            {replies}
          </span>
        </div>
      </div>
    </article>
  );
}
