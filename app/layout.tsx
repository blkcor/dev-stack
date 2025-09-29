import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { ReactNode } from 'react'

import ThemeProvider from '@/context/Theme'

import NavBar from '../components/navigation/navbar'

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
    <html lang='en' suppressHydrationWarning>
      <body className={`${Inter.variable} ${SpaceGrotesk.variable} antialiased`}>
        <ThemeProvider
          attribute='class'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange
        >
          <NavBar />
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
