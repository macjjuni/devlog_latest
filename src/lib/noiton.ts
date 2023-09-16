import { Client } from '@notionhq/client'
import { NotionAPI } from 'notion-client'
import type { PageObjectResponse, DatabaseObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { DatabaseQueryOption, IPage, INotionInfo } from '@/types/notion'
import { getPageContentBlockIds, getBlockTitle } from 'notion-utils'
import type { ExtendedRecordMap, Role, Block } from 'notion-types'

// DB 속성 테이블
export const propertyTable = {
  Date: '작성일',
  Published: '상태',
  Tags: '태그',
  Category: '카테고리',
}
const siteURL = process.env.SITE_URL || 'http://kku.dev'
const defaultThumb = `${siteURL}/image/post-cover.webp`

// 노션 인증 정보
const activeUser = process.env.NOTION_USER
const auth = process.env.NOTION_TOKEN
const authToken = process.env.NOTION_TOKEN_V2

// 공식 노션 객체 생성
export const notionClient = new Client({ auth })

// 비공식 노션 객체 생성
export const notionApi = new NotionAPI({ activeUser, authToken, userLocale: 'ko-KR/autodetect' })

const notion = {
  getNotionInfo: async (databaseId: string): Promise<INotionInfo> => {
    // 블로그 정보 조회
    const notionInfo = (await notionClient.databases.retrieve({ database_id: databaseId })) as DatabaseObjectResponse

    const title = notionInfo.title[0]?.type === 'text' ? notionInfo.title[0].plain_text : ''
    const description = notionInfo.description[0]?.type === 'text' ? notionInfo.description[0].plain_text : ''
    const coverURL = notionInfo.description[1] !== undefined ? notionInfo.description[1]?.href : '' // 블로그 목록 썸네일
    const icon = notionInfo.icon?.type === 'emoji' ? notionInfo.icon.emoji : ''
    const tags = notionInfo.properties['태그'].type === 'multi_select' ? notionInfo.properties['태그'].multi_select : null
    const category = notionInfo.properties['카테고리'].type === 'select' ? notionInfo.properties['카테고리'].select.options : null
    return { title, description, coverURL, icon, tags, category }
  },
  // 모든 페이지 리스트 검색
  getAllPage: async (datbaseId: string, option?: DatabaseQueryOption): Promise<IPage[]> => {
    // 모든 글 목록 가져오기
    const allPage = await notionClient.databases.query({
      database_id: datbaseId,
      filter: {
        and: [
          {
            property: propertyTable.Published,
            // 공개인 포스팅만 가져오기
            status: { equals: '공개' },
          },
          {
            property: propertyTable.Category,
            select: {
              equals: option?.categoryName ? option.categoryName : '',
            },
          },
        ],
      },
      sorts: [
        // 작성일 기준 정렬
        { property: propertyTable.Date, direction: 'descending' },
      ],
    })
    const pages = allPage.results as PageObjectResponse[]
    // 블로그 목록 데이터 가공
    return pages.map((page) => {
      const { id } = page
      const { 이름, 카테고리, 작성일, 태그 } = page.properties
      const title = 이름?.type === 'title' ? 이름.title[0].plain_text : ''
      const cover = defaultThumb
      const published = 작성일?.type === 'date' && 작성일.date?.start ? 작성일.date.start : ''
      const category = 카테고리?.type === 'select' ? 카테고리?.select : null
      const tags = 태그?.type === 'multi_select' ? 태그.multi_select : []

      return { id, title, category, published, tags, cover }
    })
  },
  // 특정 페이지 리스트 검색
  getPages: async (id: string) => {
    const page = await notionClient.pages.retrieve({ page_id: id })
    return page
  },
  // 페이지 검색
  getSelectPage: async (query: string) => {
    const searchPages = await notionClient.search({
      query,
      filter: {
        value: 'page',
        property: 'object',
      },
      sort: {
        direction: 'descending',
        timestamp: 'last_edited_time',
      },
      page_size: 12,
    })

    return searchPages.results as PageObjectResponse[]
  },
  // 페이지 상세 조회
  getDetailPage: async (id: string) => notionApi.getPage(id), // recordMap
}

interface ICleanBlock {
  role: Role
  value: Block
}

const cotainsType = ['header', 'sub_header', 'text']

export const getHeadDescription = (recordMap: ExtendedRecordMap) => {
  const blocks = getPageContentBlockIds(recordMap)

  const blockArr = blocks.map((blockId) => {
    if (cotainsType.includes(recordMap.block[blockId].value.type) && recordMap.block[blockId].value.properties) return recordMap.block[blockId]
  })

  // undefined 제외하고 성능 향상을 위해 블럭 5개 까지만 남기기
  const cleanBlockArr = blockArr.filter((block): block is ICleanBlock => block !== undefined).slice(0, 5)

  let contentText = ''
  // 문자열 없는 경우 빈 문자열 반환
  if (cleanBlockArr.length === 0) return contentText

  // 있는 경우 모두 합쳐서 100 글자 까지만 남기고 반환
  for (let i = 0; i < cleanBlockArr.length; i += 1) {
    const getBlcokText = getBlockTitle(cleanBlockArr[i].value, recordMap)
    contentText += `${getBlcokText} `
  }

  return contentText.substring(0, 100)
}

export default notion
