import './globals.css'

import type { Metadata } from 'next'
import localFont from 'next/font/local'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

import { auth } from '@/auth'
import { Toaster } from '@/components/ui/sonner'
import ThemeProvider from '@/context/Theme'

export const metadata: Metadata = {
  title: 'DevStack',
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  const session = await auth()

  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <link
          rel='stylesheet'
          type='text/css'
          href='https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css'
        />
      </head>
      <body className={`${Inter.variable} ${SpaceGrotesk.variable} antialiased`}>
        <SessionProvider session={session}>
          <ThemeProvider
            attribute='class'
            defaultTheme='system'
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  )
}
