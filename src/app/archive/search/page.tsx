import { cache, Suspense } from "react";
import { redirect } from "next/navigation";
import Fallback from "@/app/archive/fallBack";
import { getNotionSearchPages as _getNotionSearchPages } from "@/api/notion/page";
import ArchiveSidebar from "@/layout/archiveSidebar/archiveSidebar";
import ArchiveContent from "@/layout/archiveContent/archiveContent";
import type { Metadata } from "next";
import { generateMetaTitle } from "@/utils/meta";

export async function generateMetadata({ searchParams }: { searchParams: { q: string } }): Promise<Metadata> {
  return {
    title: generateMetaTitle(`검색: ${searchParams.q}`),
    description: process.env.NEXT_PUBLIC_DESCRIPTION,
  };
}

export const revalidate = 60;
const getNotionSearchPages = cache(_getNotionSearchPages);

export default async function ArchiveSearchPage({ searchParams }: { searchParams: { q: string } }) {
  const { info, searchPages, error } = await getNotionSearchPages(searchParams?.q || "");

  if (error || !info) {
    redirect("/404");
  }

  return (
    <Suspense fallback={<Fallback />}>
      <aside className="archive__layout__sidebar">
        <ArchiveSidebar info={info} />
      </aside>
      <section className="archive__layout__content">
        <ArchiveContent pages={searchPages} />
      </section>
    </Suspense>
  );
}
