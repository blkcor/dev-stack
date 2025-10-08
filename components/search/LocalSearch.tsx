'use client'

import { Icon } from '@iconify/react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useEffect, useState } from 'react'

import { Input } from '@/components/ui/input'
import { formUrlQuery, removeKeyFormUrlQuery } from '@/lib/url'
import { cn } from '@/lib/utils'

type Props = {
  /**
   * Search according to the url state management system
   */
  route: string
  placeHolder: string
  otherClasses?: string
  icon?: string
}
const LocalSearch = ({
  route,
  otherClasses,
  placeHolder = 'Search...',
  icon = 'material-symbols:search',
}: Props) => {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()
  const query = searchParams.get('query')

  const [searchQuery, setSearchQuery] = useState(query || '')

  useEffect(() => {
    const debouncedFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'query',
          value: searchQuery,
        })
        router.push(newUrl, { scroll: false })
      } else {
        if (pathname === route) {
          const newUrl = removeKeyFormUrlQuery({
            params: searchParams.toString(),
            keys: ['query'],
          })
          router.push(newUrl, { scroll: false })
        }
      }
    }, 500)

    return () => {
      clearTimeout(debouncedFn)
    }
  }, [router, searchParams, searchQuery, route, pathname])

  return (
    <div
      className={cn(
        'background-light800_dark300 flex min-h-[56px] grow items-center gap-4 rounded-[10px] px-4',
        otherClasses
      )}
    >
      <Icon icon={icon} className='h-6 w-6 cursor-pointer' />
      <Input
        value={searchQuery}
        placeholder={placeHolder}
        onChange={e => {
          setSearchQuery(e.target.value)
        }}
        className='paragraph-regular no-focus !background-light800_dark300 placeholder text-dark400_light700 border-none bg-transparent shadow-none outline-none'
        type='text'
      />
    </div>
  )
}

export default LocalSearch
