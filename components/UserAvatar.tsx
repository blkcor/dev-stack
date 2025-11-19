import { Avatar } from '@radix-ui/react-avatar'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ROUTES from '@/constants/routes'
import { cn } from '@/lib/utils'

import { AvatarFallback } from './ui/avatar'

type Props = {
  id: string
  name: string
  imageUrl?: string | null
  className?: string
  fallbackClassName?: string
}
const UserAvatar = ({ id, name, imageUrl, className, fallbackClassName }: Props) => {
  const initials = name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2)
  return (
    <Link href={ROUTES.PROFILE(id)}  >
      <Avatar className={`size-9 flex items-center justify-center rounded-full overflow-hidden ${className}`}>
        {
          imageUrl ? (
            <Image src={imageUrl} alt={name} className='object-cover rounded-full' width={36} height={36} quality={100} />
          ) : (
            <AvatarFallback className={cn('primary-gradient font-space-grotesk font-bold tracking-wider text-white', fallbackClassName)}>
              {initials}
            </AvatarFallback>
          )
        }
      </Avatar>
    </Link>
  )
}

export default UserAvatar
