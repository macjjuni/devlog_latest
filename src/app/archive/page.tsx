import { Suspense } from "react";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getMetadata } from "@/config/meta";
import ArchiveSidebar from "@/layout/archiveSidebar/archiveSidebar";
import ArchiveContent from "@/layout/archiveContent/archiveContent";
import { isNumber } from "@/utils/string";
import Fallback from "./fallBack";
import { AllPages } from "@/app/api/notion/allPages/route";

export const metadata: Metadata = getMetadata("Archive", null, "archive", null);

export const revalidate = 10;

async function getAllpage(): Promise<AllPages> {
  return fetch(`${process.env.NEXT_PUBLIC_DOMAIN}/api/notion/allPages`, {
    next: { revalidate },
  }).then((res) => res.json());
}

export default async function ArchivePage({ searchParams }: { searchParams: { page: string | undefined } }) {
  const { page } = searchParams;

  // 숫자 형식이 아닌 페이지 사이즈 접근 에러 핸들링(use server)
  if (page !== undefined && !isNumber(page)) {
    redirect("/404");
  }

  const { info, pages, error } = await getAllpage();

  if (error) {
    redirect("/404");
  }

  return (
    <Suspense fallback={<Fallback />}>
      <aside className="archive__layout__sidebar">
        <ArchiveSidebar info={info} />
      </aside>
      <section className="archive__layout__content">
        <ArchiveContent pages={pages} />
      </section>
    </Suspense>
  );
}
