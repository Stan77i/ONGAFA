import type { Metadata } from "next";
import { Suspense } from "react";
import { PostForm } from "@/components/community/CommunityForms";
import { NarrowPage } from "@/components/layout/NarrowPage";
import { CardSkeleton } from "@/components/ui/Skeleton";
import { requireSessionUser } from "@/lib/auth/session";
import { getPostCategories } from "@/lib/community/data";
import { getCrops, getRegions } from "@/lib/producers/data";

export const metadata: Metadata = { title: "Poser une question à la communauté", robots: { index: false } };

async function Form() {
  await requireSessionUser("/communaute/nouveau");
  const [categories, crops, regions] = await Promise.all([getPostCategories(), getCrops(), getRegions()]);
  return <PostForm categories={categories} crops={crops} regions={regions} />;
}

export default function NewPostPage() {
  return (
    <NarrowPage
      eyebrow="Communauté"
      title="Poser une question"
      intro={
        <p>
          Les premiers messages d&apos;un nouveau membre sont relus par l&apos;équipe AFA avant publication.
        </p>
      }
    >
      <Suspense fallback={<CardSkeleton />}>
        <Form />
      </Suspense>
    </NarrowPage>
  );
}
