import type { Metadata } from "next";
import { Suspense } from "react";
import { MessageSquarePlus } from "lucide-react";
import { DiscussionCard } from "@/components/content/DiscussionCard";
import { PageHero } from "@/components/layout/PageHero";
import { Section } from "@/components/layout/Section";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FilterChips } from "@/components/ui/FilterChips";
import { Pagination } from "@/components/ui/Pagination";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { FORUM_PAGE_SIZE, getPostCategories, listPosts } from "@/lib/community/data";
import { getNewsFilters } from "@/lib/content/data";

export const metadata: Metadata = {
  title: "Communauté",
  description:
    "Le forum des producteurs, productrices et acteurs du manioc et du vivrier en Côte d'Ivoire : questions techniques, vente et achat, transformation, financement.",
};

type Search = { theme?: string; culture?: string; page?: string };

function hrefFor(p: Search, patch: Partial<Search>) {
  const n = { ...p, ...patch };
  const qs = new URLSearchParams();
  if (n.theme) qs.set("theme", n.theme);
  if (n.culture) qs.set("culture", n.culture);
  if (n.page && n.page !== "1") qs.set("page", n.page);
  const s = qs.toString();
  return s ? `/communaute?${s}` : "/communaute";
}

async function Forum({ searchParams }: { searchParams: Promise<Search> }) {
  const params = await searchParams;
  const page = Math.max(1, Number.parseInt(params.page ?? "1", 10) || 1);
  const [categories, { crops }, { items, total }] = await Promise.all([
    getPostCategories(),
    getNewsFilters(),
    listPosts({ category: params.theme, crop: params.culture, page }),
  ]);
  const filtered = Boolean(params.theme || params.culture);
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <FilterChips
          label="Filtrer par thème"
          activeValue={params.theme ?? "tout"}
          items={[
            {
              value: "tout",
              label: "Tous les thèmes",
              href: hrefFor(params, { theme: undefined, page: undefined }),
            },
            ...categories.map((c) => ({
              value: c.slug,
              label: c.name,
              href: hrefFor(params, { theme: c.slug, page: undefined }),
            })),
          ]}
        />
        <FilterChips
          label="Filtrer par culture"
          activeValue={params.culture ?? "toutes"}
          items={[
            {
              value: "toutes",
              label: "Toutes les cultures",
              href: hrefFor(params, { culture: undefined, page: undefined }),
            },
            ...crops.map((c) => ({
              value: c.slug,
              label: c.name,
              href: hrefFor(params, { culture: c.slug, page: undefined }),
            })),
          ]}
        />
      </div>
      {items.length === 0 ? (
        <EmptyState
          title={filtered ? "Aucune discussion pour ces filtres" : "Lancez la première discussion"}
          action={
            <Button href="/communaute/nouveau" variant="accent">
              Poser une question
            </Button>
          }
        >
          {filtered
            ? "Essayez un autre thème, ou posez votre question : la communauté et l'équipe AFA vous répondront."
            : "Une question sur le manioc, un acheteur à trouver, une technique de transformation ? La communauté est là pour s'entraider."}
        </EmptyState>
      ) : (
        <ul className="space-y-3">
          {items.map((p) => (
            <li key={p.id}>
              <DiscussionCard
                discussion={{
                  href: `/communaute/${p.id}`,
                  question: p.isPinned ? `📌 ${p.title}` : p.title,
                  authorName: p.authorName,
                  place: p.region ?? undefined,
                  crop: p.crop?.name,
                  replies: p.replyCount,
                  askedAt: p.createdAt,
                }}
              />
            </li>
          ))}
        </ul>
      )}
      <Pagination
        page={page}
        totalPages={Math.max(1, Math.ceil(total / FORUM_PAGE_SIZE))}
        hrefFor={(n) => hrefFor(params, { page: String(n) })}
      />
    </div>
  );
}

export default function CommunityPage({ searchParams }: PageProps<"/communaute">) {
  return (
    <>
      <PageHero
        crumbs={[
          { href: "/", label: "Accueil" },
          { href: "/communaute", label: "Communauté" },
        ]}
        eyebrow="Entraide"
        title="La communauté AFA"
        intro={
          <p>
            Posez vos questions, partagez votre expérience, trouvez des acheteurs : producteurs,
            transformatrices, commerçantes et équipe AFA s&apos;entraident ici.
          </p>
        }
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            href="/communaute/nouveau"
            variant="accent"
            icon={<MessageSquarePlus className="size-5" aria-hidden="true" />}
          >
            Poser une question
          </Button>
          <Button href="/charte-communaute" variant="ghost">
            Charte de la communauté
          </Button>
        </div>
      </PageHero>
      <Section labelledBy="t-forum">
        <h2 id="t-forum" className="sr-only">
          Discussions
        </h2>
        <Suspense fallback={<CardSkeleton />}>
          <Forum searchParams={searchParams as Promise<Search>} />
        </Suspense>
      </Section>
    </>
  );
}
