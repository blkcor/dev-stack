import Link from 'next/link'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { getDevIconClass } from '@/lib/utils'

type Props = {
  _id: string
  name: string
  questions?: number
  showCount?: boolean
  compact?: boolean
}
const TagCard = ({ _id, name, showCount, questions }: Props) => {
  const iconClass = getDevIconClass(name)
  return (
    <Link
      href={`/tags/${_id}`}
      className='flex items-center justify-between gap-2 transition-all hover:scale-105 hover:opacity-80'
    >
      <Badge className='subtle-medium !background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>
        <div className='flex-center space-x-2'>
          <i className={iconClass} />
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && <p className='small-medium text-dark500_light700'>{questions}</p>}
    </Link>
  )
}

export default TagCard
