import { X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { getDevIconClass, getTagInitial, hasDevIcon } from '@/lib/utils'

type Props = {
  _id: string
  name: string
  questions?: number
  showCount?: boolean
  compact?: boolean
  removeAble?: boolean
  handleRemove?: () => void
  isButton?: boolean
}
const TagCard = ({
  _id,
  name,
  showCount,
  questions,
  removeAble,
  handleRemove,
  isButton,
}: Props) => {
  const iconClass = getDevIconClass(name)
  const showIcon = hasDevIcon(name)
  const initial = getTagInitial(name)
  const containerClass =
    'group relative flex items-center justify-between gap-2 transition-all hover:scale-105 hover:opacity-80'
  const CardContent = (
    <>
      <Badge className='subtle-medium !background-light800_dark300 text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>
        <div className='flex-center space-x-2'>
          {showIcon ? (
            <i className={iconClass} />
          ) : (
            <span className='flex-center bg-primary-500/20 text-primary-500 size-4 rounded-full text-[10px] font-bold'>
              {initial}
            </span>
          )}
          <span>{name}</span>
        </div>
      </Badge>

      {showCount && <p className='small-medium text-dark500_light700'>{questions}</p>}

      {removeAble && handleRemove && (
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            handleRemove()
          }}
          className='background-light900_dark400 hover:text-light-400 hover:background-light400_dark900 absolute -top-1 -right-1 cursor-pointer rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100'
          aria-label='Remove tag'
        >
          <X className='text-light900_dark400 size-2' />
        </button>
      )}
    </>
  )
  return (
    <>
      {isButton ? (
        <Button className={containerClass}>{CardContent}</Button>
      ) : (
        <Link href={`/tags/${_id}`} className={containerClass}>
          {CardContent}
        </Link>
      )}
    </>
  )
}

export default TagCard
