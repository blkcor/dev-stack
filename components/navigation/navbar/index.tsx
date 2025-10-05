import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import Theme from './theme'

const NavBar = () => {
  return (
    <nav className='flex-between background-light900_dark200 shadow-light-300 fixed z-50 w-full gap-5 p-6 sm:px-12 dark:shadow-none'>
      <Link href='/' className='flex items-center gap-1'>
        <Image src='/images/logo.svg' width={23} height={23} alt='devstack logo' />
        <p className='h2-bold font-space-grotesk text-dark-100 dark:text-light-900 max-sm:hidden'>
          Dev<span className='text-primary-500'>Stack</span>
        </p>
      </Link>
      {/* TODO: global search */}
      <p>Global Search</p>
      <div className='flex-between gap-5'>
        <Theme />
      </div>
    </nav>
  )
}

export default NavBar
