'use client'

import { Icon } from '@iconify/react'
import { signIn } from 'next-auth/react'
import React from 'react'
import { toast } from 'sonner'

import ROUTES from '@/constants/routes'
import { authList, ProviderName } from '@/consts/auth'

import { Button } from '../ui/button'

const SocialAuthForm = () => {
  const handleSignIn = async (provider: ProviderName) => {
    try {
      await signIn(provider, {
        redirectTo: ROUTES.HOME,
        redirect: true,
      })
    } catch (error) {
      toast.error('Sign in failed', {
        description:
          error instanceof Error ? error.message : 'An error occurred when trying to sign in',
        position: 'top-center',
        icon: <Icon icon='material-icon-theme:folder-error' className='h-5 w-5' />,
      })
    }
  }

  return (
    <div className='mt-10 flex flex-wrap gap-2.5'>
      {authList.map(({ provider, icon }) => (
        <Button
          key={provider}
          className='background-light900_dark400 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 cursor-pointer px-4 py-3.5'
          onClick={() => handleSignIn(provider)}
        >
          <Icon icon={icon} className='mr-2.5 h-5 w-5' />
          <span>Login with {provider}</span>
        </Button>
      ))}
    </div>
  )
}

export default SocialAuthForm
