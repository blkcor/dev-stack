import { Icon } from '@iconify/react'
import * as React from 'react'

import { formatCount } from '@/lib/utils'

type Props = {
  icon: string
  count: number
  type: string
}
const Matric = ({ icon, count, type }: Props) => {
  return (
    <div className='flex cursor-pointer items-center gap-1.5 transition-all duration-200'>
      <Icon
        icon={icon}
        className='text-dark300_light900 hover:text-primary-500 h-5 w-5 transition-colors duration-200'
      />
      <span className='text-dark400_light800 text-sm font-medium max-sm:hidden'>
        {formatCount(count)}&nbsp;{type}
      </span>
    </div>
  )
}

export default Matric
