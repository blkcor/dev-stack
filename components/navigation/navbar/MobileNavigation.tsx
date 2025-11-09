import { Icon } from '@iconify/react'
import Image from 'next/image'
import Link from 'next/link'
import * as React from 'react'

import { auth } from '@/auth'
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
import { signOutAction } from '@/lib/actions/auth.action'

const MobileNavigation = async () => {
  const session = await auth()
  const userId = session?.user?.id
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Icon
          icon='quill:hamburger'
          className='hover:text-primary-500 h-9 w-9 cursor-pointer transition-all duration-200 ease-in-out hover:scale-110 active:scale-95 sm:hidden'
        />
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
            {
              userId ? (
                <SheetClose asChild>
                  <form action={async () => {
                    "use server"
                    await signOutAction()
                  }}>
                    <Button
                      type='submit'
                      className='small-medium btn-secondary hover:bg-primary-100 dark:hover:bg-primary-900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'
                    >
                      <div className='flex items-center gap-4'>
                        <Icon icon='material-symbols:logout' className='text-dark300_light900 h-5 w-5' />
                        <span className='primary-text-gradient'>Log Out</span>
                      </div>
                    </Button>
                  </form>
                </SheetClose>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link href={ROUTES.SIGN_IN}>
                      <Button className='small-medium btn-secondary hover:bg-primary-100 dark:hover:bg-primary-900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'>
                        <span className='primary-text-gradient'>Log In</span>
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href={ROUTES.SIGN_UP}>
                      <Button className='small-medium light-borde-2 btn-tertiary text-dark400_light900 hover:bg-light-800 dark:hover:bg-dark-300 hover:text-primary-500 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-all duration-200 ease-in-out hover:scale-[1.02] hover:shadow-md active:scale-[0.98]'>
                        <span>Sign Up</span>
                      </Button>
                    </Link>
                  </SheetClose>
                </>
              )
            }
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MobileNavigation
