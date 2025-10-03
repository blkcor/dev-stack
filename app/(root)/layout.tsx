import React from 'react'

import NavBar from '@/components/navigation/navbar'

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode
}>) => {
  return (
    <>
      <NavBar />
      {children}
    </>
  )
}

export default RootLayout
