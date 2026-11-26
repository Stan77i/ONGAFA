import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MapPin, MessageCircle } from "lucide-react";
import { CommentForm, ReportButton } from "@/components/community/CommunityForms";
import { Container } from "@/components/layout/Section";
import { Alert } from "@/components/ui/Alert";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Button } from "@/components/ui/Button";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { getSessionUser } from "@/lib/auth/session";
import { getPost } from "@/lib/community/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Discussion" };

function PendingBadge() {
  return <Badge tone="warning">En attente de validation : visible par vous seul</Badge>;
}

async function Thread({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ envoi?: string }>;
}) {
  const [{ id }, sp, user] = await Promise.all([params, searchParams, getSessionUser()]);
  const post = await getPost(id);
  if (!post) notFound();
  const visibleComments = post.comments.filter((c) => c.status === "published" || c.authorId === user?.id);
  return (
    <div className="space-y-6">
      {sp.envoi === "attente" && (
        <Alert tone="info" title="Merci pour votre message">
          Il sera visible de tous après validation par l&apos;équipe AFA. En attendant, vous seul le voyez.
        </Alert>
      )}
      <article className="space-y-4 rounded-card bg-white p-5 text-ink ring-1 ring-rule sm:p-8">
        <div className="flex flex-wrap items-center gap-2">
          {post.category && <Badge tone="category">{post.category.name}</Badge>}
          {post.crop && <Badge tone="crop">{post.crop.name}</Badge>}
          {post.status === "pending" && <PendingBadge />}
        </div>
        <h1 className="font-display text-h2 font-semibold text-forest">{post.title}</h1>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-ink-soft">
          <Avatar name={post.authorName} size={32} className="text-xs" />
          <span className="font-semibold text-ink">{post.authorName}</span>
          <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
          {post.region && (
            <span className="flex items-center gap-1">
              <MapPin className="size-4" aria-hidden="true" />
              {post.region}
            </span>
          )}
        </div>
        <p className="whitespace-pre-line">{post.body}</p>
        <div className="flex justify-end">
          <ReportButton targetType="post" targetId={post.id} signedIn={Boolean(user)} />
        </div>
      </article>

      <section aria-labelledby="t-reponses" className="space-y-4">
        <h2
          id="t-reponses"
          className="flex items-center gap-2 font-display text-h3 font-semibold text-forest"
        >
          <MessageCircle className="size-6" aria-hidden="true" />
          {post.replyCount === 0
            ? "Pas encore de réponse"
            : `${post.replyCount} réponse${post.replyCount > 1 ? "s" : ""}`}
        </h2>
        <ul className="space-y-3">
          {visibleComments.map((c) => (
            <li key={c.id} className="space-y-2 rounded-card bg-white p-4 text-ink ring-1 ring-rule">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-meta text-ink-soft">
                <Avatar name={c.authorName} size={28} className="text-xs" />
                <span className="font-semibold text-ink">{c.authorName}</span>
                <time dateTime={c.createdAt}>{formatDate(c.createdAt)}</time>
                {c.status === "pending" && <PendingBadge />}
              </div>
              <p className="whitespace-pre-line">{c.body}</p>
              <div className="flex justify-end">
                <ReportButton targetType="comment" targetId={c.id} signedIn={Boolean(user)} />
              </div>
            </li>
          ))}
        </ul>
        <div className="rounded-card bg-white p-5 text-ink ring-1 ring-rule">
          {post.status !== "published" ? (
            <p className="text-ink-soft">Les réponses seront possibles une fois le sujet validé.</p>
          ) : user ? (
            <CommentForm postId={post.id} />
          ) : (
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>Connectez-vous pour répondre.</p>
              <Button href={`/connexion?next=/communaute/${post.id}`}>Se connecter</Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function ThreadPage({ params, searchParams }: PageProps<"/communaute/[id]">) {
  return (
    <div className="bg-sand py-8 sm:py-12">
      <Container className="max-w-3xl space-y-6">
        <Breadcrumb
          items={[
            { href: "/", label: "Accueil" },
            { href: "/communaute", label: "Communauté" },
            { href: "#", label: "Discussion" },
          ]}
        />
        <Suspense fallback={<CardSkeleton />}>
          <Thread params={params} searchParams={searchParams as Promise<{ envoi?: string }>} />
        </Suspense>
      </Container>
    </div>
  );
}
