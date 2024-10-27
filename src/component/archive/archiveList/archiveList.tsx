"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import config from "@/config/config";
import usePageSize from "@/hook/usePageSize";
import date from "@/lib/date";
import "./archiveList.scss";
import { ArchiveData } from "@/@types/archive";

const { archive } = config;

export default function ArchiveList({ archives }: { archives: ArchiveData[] }) {
  // region [Hooks]

  const page = usePageSize("page");

  // endregion

  // region [Privates]

  const pageList = useMemo(() => archives.slice(archive.POSTS_PER_PAGE * (page - 1), archive.POSTS_PER_PAGE * page), [page, archives]);

  const isNew = useCallback((dateStr: string) => archive.RECENT_DAY > date.nowDiff(dateStr), []);

  // endregion

  return (
    <ul className="archive__list">
      {pageList.map((listItem) => (
        <li key={listItem.url} className="archive__list__item">
          <Link href={`/archive/${listItem.url}`} className={`archive__list__item__link${isNew(listItem?.date) ? " new" : ""}`} suppressHydrationWarning>
            <h3 className="archive__list__item__title">{listItem?.title}</h3>
            <div className="archive__list__item__right">
              <p>{listItem?.category}</p>
              <p>{date.format(listItem?.date)}</p>
            </div>
          </Link>
        </li>
      ))}
      {pageList.length === 0 && <li className="archive__list__item-no-text">검색 결과가 없습니다.</li>}
    </ul>
  );
}
