'use client'

import { Icon } from '@iconify/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import * as React from 'react'

import { SheetClose } from '@/components/ui/sheet'
import { navLinks } from '@/constants/navLinks'
import { cn } from '@/lib/utils'

interface Props {
  isMobile?: boolean
}

const NavLinks = ({ isMobile }: Props) => {
  const pathname = usePathname()
  return (
    <>
      {navLinks.map(link => {
        const isActive =
          (pathname.includes(link.route) && link.route.length > 1) || pathname === link.route

        const linkComponent = (
          <Link
            key={link.label}
            href={link.route}
            className={cn(
              'flex items-center justify-start gap-4 bg-transparent p-4 transition-all duration-200 ease-in-out',
              isActive
                ? 'primary-gradient text-light-900 rounded-lg'
                : 'text-dark300_light900 hover:bg-light-800 hover:text-primary-500 dark:hover:bg-dark-300 dark:hover:text-primary-500 rounded-lg hover:shadow-sm'
            )}
          >
            <Icon icon={link.icon} className={cn('h-5 w-5', !isActive && 'invert-colors')} />
            <p className={cn(isActive ? 'base-bold' : 'base-medium', !isMobile && 'max-lg:hidden')}>
              {link.label}
            </p>
          </Link>
        )
        return isMobile ? (
          <SheetClose asChild key={link.route}>
            {linkComponent}
          </SheetClose>
        ) : (
          <React.Fragment key={link.route}>{linkComponent}</React.Fragment>
        )
      })}
    </>
  )
}

export default NavLinks
