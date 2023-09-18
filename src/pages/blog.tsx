import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import type { GetStaticProps } from 'next'
import type { IPage, INotionInfo } from '@/types/notion'

import notion from '@/lib/noiton'
import config from '@/config/notion.config'
import common from '@/styles/common'

import CategoryList from '@/components/oraganisms/CategoryList'
import PostList from '@/components/oraganisms/PostList'
import Pagination from '@/components/molecule/Pagination'
import NextHead from '@/components/seo/DefaultMeta'

interface IBlogPage {
  info: INotionInfo
  pages: IPage[]
}

export const getStaticProps: GetStaticProps<IBlogPage> = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID
  try {
    if (!databaseId) throw new Error('DATABASE_ID is undefined.')

    const info = await notion.getNotionInfo(databaseId)
    const pages = await notion.getAllPage(databaseId)

    return {
      props: { info, pages },
      revalidate: 60,
    }
  } catch (e) {
    console.error(e)
    return { notFound: true }
  }
}

const { POSTS_PER_PAGE } = config.post

const BlogPage = ({ pages, info }: IBlogPage) => {
  const { query } = useRouter()
  const currentPage = query.page ? parseInt(query.page.toString(), 10) : 1
  const [pageList, setPageList] = useState(pages.slice(POSTS_PER_PAGE * (currentPage - 1), POSTS_PER_PAGE * currentPage))

  useEffect(() => {
    setPageList(pages.slice(POSTS_PER_PAGE * (currentPage - 1), POSTS_PER_PAGE * currentPage))
  }, [currentPage, pages])

  return (
    <>
      <NextHead title="Blog" />
      <aside className={`max-w-left w-full p-sm border-r ${common.borderColor}`}>
        <CategoryList categories={info.category} pages={pages} />
      </aside>

      <section className="max-w-right w-full p-sm">
        <PostList list={pageList} />
        <Pagination current={currentPage} total={pages.length} />
      </section>
    </>
  )
}

export default BlogPage
