import React from 'react'

import LeftSidebar from '@/components/navigation/LeftSidebar'
import NavBar from '@/components/navigation/navbar'
import RightSidebar from '@/components/navigation/RightSidebar'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <main className='background-light850_dark100 relative'>
      <NavBar />
      <div className='flex'>
        <LeftSidebar />
        <section className='flex min-h-screen flex-1 flex-col px-6 pt-36 pb-6 max-md:pb-14 sm:px-14'>
          <div className='mx-auto w-full max-w-5xl'>{children}</div>
        </section>
        <RightSidebar />
      </div>
    </main>
  )
}

export default RootLayout
