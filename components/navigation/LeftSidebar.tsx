import { Icon } from '@iconify/react'
import Link from 'next/link'
import * as React from 'react'

import NavLinks from '@/components/navigation/navbar/NavLinks'
import { Button } from '@/components/ui/button'
import ROUTES from '@/constants/routes'

const LeftSidebar = () => {
  return (
    <section className='custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 left-0 flex h-screen flex-col justify-between overflow-y-auto border-r p-6 pt-36 max-sm:hidden lg:w-[266px] dark:shadow-none'>
      <div className='flex flex-1 flex-col gap-6'>
        <NavLinks />
      </div>
      <div className='flex flex-col gap-3'>
        <Button
          className='small-medium btn-secondary min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-all hover:scale-105 hover:opacity-90'
          asChild
        >
          <Link href={ROUTES.SIGN_IN}>
            <div className='flex items-center gap-4 lg:mr-[10px]'>
              <Icon icon='material-symbols:login-sharp' className='text-dark300_light900 h-5 w-5' />
              <span className='primary-text-gradient max-lg:hidden'>Log In</span>
            </div>
          </Link>
        </Button>
        <Button
          className='small-medium light-borde-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none transition-all hover:scale-105 hover:opacity-90'
          asChild
        >
          <Link href={ROUTES.SIGN_UP}>
            <div className='flex items-center gap-4'>
              <Icon
                icon='streamline-plump:fill-and-sign'
                className='text-dark300_light900 h-5 w-5'
              />
              <span className='max-lg:hidden'>Sign Up</span>
            </div>
          </Link>
        </Button>
      </div>
    </section>
  )
}

export default LeftSidebar
