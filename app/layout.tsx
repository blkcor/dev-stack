import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'DevFlow',
  description: 'A better replacement of stack overflow',
  icons: {
    icon: '/images/logo.svg',
  },
}

const Inter = localFont({
  src: './fonts/Inter.ttf',
  variable: '--font-inter',
  weight: '100 200 300 400 500 600 700 800 900',
})

const SpaceGrotesk = localFont({
  src: './fonts/SpaceGrotesk.ttf',
  variable: '--font-space-grotesk',
  weight: '400 500 600 700',
})

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${Inter.variable} ${SpaceGrotesk.variable} antialiased`}>{children}</body>
    </html>
  )
}
