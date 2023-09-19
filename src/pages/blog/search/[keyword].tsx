import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import type { GetServerSideProps } from 'next'
import type { IBlogPage, IPage } from '@/types/notion'

import config from '@/config/notion.config'
import common from '@/styles/common'
import notion from '@/lib/noiton'

import NextHead from '@/components/seo/DefaultMeta'
import Profile from '@/components/molecule/Profile'
import CategoryList from '@/components/oraganisms/CategoryList'
import PageHeading from '@/components/atom/PageHeading'
import PostList from '@/components/oraganisms/PostList'
import Pagination from '@/components/molecule/Pagination'

interface ISearch extends IBlogPage {
  searchPages: IPage[]
}

export const getServerSideProps: GetServerSideProps = async ({ res, params }) => {
  const keyword = params?.keyword
  if (!keyword || keyword === '') return { redirect: { destination: '/', permanent: false } }

  res.setHeader('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=60')

  try {
    const databaseId = process.env.NOTION_DATABASE_ID
    if (!databaseId) throw new Error('DATABASE_ID is not defined')
    if (typeof keyword !== 'string') throw new Error('Keyword Type Error!')

    const searchPages = await notion.getSelectPage(keyword)
    const pages = await notion.getAllPage(databaseId)
    const info = await notion.getNotionInfo(databaseId)

    return { props: { searchPages, pages, info } }
  } catch (e) {
    console.error(e)
    return {
      redirect: {
        destination: '/blog',
        permanent: false,
      },
    }
  }
}

const { POSTS_PER_PAGE } = config.post

const SearchPage = ({ searchPages, pages, info }: ISearch) => {
  const { query } = useRouter()
  const { keyword } = query

  const currentPage = query.page ? parseInt(query.page.toString(), 10) : 1
  const [pageList, setPageList] = useState(searchPages.slice(POSTS_PER_PAGE * (currentPage - 1), POSTS_PER_PAGE * currentPage))

  useEffect(() => {
    setPageList(searchPages.slice(POSTS_PER_PAGE * (currentPage - 1), POSTS_PER_PAGE * currentPage))
  }, [currentPage, searchPages])
  return (
    <>
      <NextHead title={`Blog > ${query.name}`} />
      <aside className={`max-w-left w-full p-sm border-r ${common.borderColor}`}>
        <Profile info={info} />
        <CategoryList categories={info.category} pages={pages} />
      </aside>

      <section className="max-w-right w-full p-sm">
        <PageHeading title={`검색 키워드: ${keyword}`} count={searchPages.length} />
        <PostList list={pageList} />
        <Pagination current={currentPage} total={searchPages.length} />
      </section>
    </>
  )
}

export default SearchPage
