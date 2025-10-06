import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import NavLinks from '@/components/navigation/navbar/NavLinks'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import ROUTES from '@/constants/routes'

const MobileNavigation = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Icon icon='quill:hamburger' className='invert-colors h-9 w-9 cursor-pointer sm:hidden' />
      </SheetTrigger>
      <SheetContent side='left' className='background-light900_dark200 border-none'>
        <SheetHeader>
          <SheetTitle className='hidden'>Navigation</SheetTitle>
          <Link href='/' className='flex items-center gap-1'>
            <Image src='/images/logo.svg' alt='logo' width={23} height={23} />
            <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900'>
              Dev<span className='text-primary-500'>Stack</span>
            </p>
          </Link>
        </SheetHeader>
        <div className='no-scrollbar flex h-[calc(100vh-80px)] flex-col justify-between overflow-y-auto px-4'>
          <section className='flex h-full flex-col gap-6 pt-16'>
            <NavLinks isMobile />
          </section>

          <div className='flex flex-col gap-3 p-4'>
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_IN}>
                <Button className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                  <span className='primary-text-gradient'>Log In</span>
                </Button>
              </Link>
            </SheetClose>
            <SheetClose asChild>
              <Link href={ROUTES.SIGN_UP}>
                <Button className='small-medium light-borde-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none'>
                  <span>Sign Up</span>
                </Button>
              </Link>
            </SheetClose>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
