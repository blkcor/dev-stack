'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import * as React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { filters, type FilterName } from '@/constants/filters'
import { formUrlQuery, removeKeyFormUrlQuery } from '@/lib/url'
import { cn } from '@/lib/utils'

const HomeFilter = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const filter = searchParams.get('filter')
  const [activeFilter, setActiveFilter] = useState<FilterName | null>(filter as FilterName)

  const handlePushFilter = (filter: FilterName) => {
    let newUrl = ''
    if (filter) {
      // if the filter clicked is the same as the current filter, remove the filter from the url and the active filter
      if (filter === activeFilter) {
        newUrl = removeKeyFormUrlQuery({
          params: searchParams.toString(),
          keys: ['filter'],
        })
        setActiveFilter(null)
      } else {
        // construct the new url with the filter and set the active filter to the clicked filter
        newUrl = formUrlQuery({
          params: searchParams.toString(),
          key: 'filter',
          value: filter,
        })
        setActiveFilter(filter)
      }
      router.push(newUrl, { scroll: false })
    }
  }
  return (
    <div className='mt-10 hidden flex-wrap gap-3 sm:flex'>
      {filters.map(filter => {
        return (
          <Button
            onClick={() => handlePushFilter(filter.name)}
            className={cn(
              'body-medium cursor-pointer rounded-lg px-6 py-3 capitalize shadow-none',
              activeFilter === filter.name
                ? 'bg-primary-100 text-primary-500 hover:bg-primary-100 dark:bg-dark-400 dark:text-primary-500 dark:hover:bg-dark-400'
                : 'bg-light-800 text-light-500 hover:bg-light-800 dark:bg-dark-300 dark:text-light-500 dark:hover:bg-dark-300'
            )}
            key={filter.name}
          >
            {filter.name}
          </Button>
        )
      })}
    </div>
  )
}

export default HomeFilter
