import { Icon } from '@iconify/react'
import React from 'react'

import { authList } from '@/consts/auth'

import { Button } from '../ui/button'
const SocialAuthForm = () => {
  return (
    <div className='mt-10 flex flex-wrap gap-2.5'>
      {authList.map(({ provider, icon }) => (
        <Button
          key={provider}
          className='background-light900_dark400 0 body-medium text-dark200_light800 rounded-2 min-h-12 flex-1 px-4 py-3.5'
        >
          <Icon icon={icon} className='invert-colors mr-2.5 h-5 w-5' />
          <span>Login with {provider}</span>
        </Button>
      ))}
    </div>
  )
}

export default SocialAuthForm
