import Image from 'next/image'
import React from 'react'

import SocialAuthForm from '@/components/forms/SocialAuthForm'

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className='bg-auth-light dark:bg-auth-dark flex min-h-screen w-full items-center justify-center bg-cover bg-center bg-no-repeat px-4 py-10'>
      <section className='light-border background-light800_dark200 shadow-light-100 dark:shadow-dark-100 min-w-full rounded-[10px] border px-4 py-10 sm:min-w-[520px] sm:px-8'>
        <div className='flex items-center justify-between gap-2'>
          <div className='space-y-2.5'>
            <h1 className='h2-bold text-dark100_light900'>Join DevStack</h1>
            <p className='paragraph-regular text-dark500_light500'>To get your question answered</p>
          </div>
          <Image
            src={'/images/logo.svg'}
            alt='DevStack Logo'
            width={50}
            height={50}
            className='object-contain'
          />
        </div>

        {children}

        <SocialAuthForm />
      </section>
    </main>
  )
}

export default AuthLayout
