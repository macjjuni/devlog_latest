import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { verticalPostCatItemMotion } from '@/utils/framer'
import common from '@/styles/common'

interface ICatItem {
  categoryName: string
  path: string
  count: number
}

const defaultStyle = `flex py-sm ${common.textHover}`
const normalStyle = `${defaultStyle} text-category`
const activeStyle = `${defaultStyle} text-categoryActive`

const CategoryItem = ({ categoryName, path, count }: ICatItem) => {
  const { query } = useRouter()

  const catName = query?.name as string | undefined
  const lowerCatName = categoryName.toLowerCase()

  // 현재 카테고리에 맞는 페이지인지 체크
  const activeChekcer = () => {
    if (lowerCatName.includes('all') && catName === undefined) return activeStyle
    if (catName === undefined) return normalStyle
    return lowerCatName.includes(catName.toLowerCase()) ? activeStyle : normalStyle
  }

  return (
    <motion.li variants={verticalPostCatItemMotion}>
      <Link href={path} className={activeChekcer()}>
        {`${categoryName} (${count})`}
      </Link>
    </motion.li>
  )
}

export default CategoryItem
