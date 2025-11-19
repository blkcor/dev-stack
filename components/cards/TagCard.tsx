import { X } from 'lucide-react'
import Link from 'next/link'
import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'
import { cn, getDevIconClass, getTagInitial, getTechDescription, hasDevIcon, TAG_NAME_MAP } from '@/lib/utils'

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
  compact = false,
  isButton,
}: Props) => {
  const iconClass = getDevIconClass(name)
  const iconDescription = getTechDescription(name)
  const showIcon = hasDevIcon(name)
  const initial = getTagInitial(name)
  const containerClass =
    'group relative flex items-center justify-between gap-2 transition-all hover:scale-105 hover:opacity-80'
  const CardContent = (
    <>
      <Badge className='subtle-medium background-light800_dark300! text-light400_light500 rounded-md border-none px-4 py-2 uppercase'>
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
  if (compact) {
    return (
      <>
        {isButton ? (
          <Button className={containerClass}>{CardContent}</Button>
        ) : (
          <Link href={ROUTES.TAG(_id)} className={containerClass}>
            {CardContent}
          </Link>
        )}
      </>
    )
  }

  // not compact version with tech description
  return (
    <Link href={ROUTES.TAG(_id)} className="shadow-light-100_darknone">
      <article className='background-light900_dark200 light-border flex w-full flex-col rounded-2xl border px-8 py-10 sm:w-65'>
        <div className='flex items-center justify-between gap-3'>
          <div className='background-light800_dark300 w-fit rounded-sm px-5 py-1.5'>
            <p className='paragraph-semibold text-dark300_light900'>{name}</p>
          </div>
          {
            TAG_NAME_MAP[name] ? <i className={cn(iconClass, 'text-2xl')} aria-hidden="true" /> : <span className='flex-center bg-primary-500/20 text-primary-500 size-4 rounded-full text-[10px] font-bold'>
              {initial}
            </span>
          }

        </div>
        <p className='small-regular text-dark500_light700 mt-5 line-clamp-3 w-full'>
          {iconDescription}
        </p>
        <p className='small-medium text-dark400_light500 mt-3.5'>
          <span className='body-semibold primary-text-gradient mr-2.5'>
            {questions}+
          </span>
          Questions
        </p>
      </article>
    </Link>
  )

}

export default TagCard
