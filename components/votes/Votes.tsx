'use client'

import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { formatCount } from '@/lib/utils'

interface Props {
  upvotes: number
  downvotes: number
  hasUpVote: boolean
  hasDownVote: boolean
}
const Votes = ({
  upvotes,
  downvotes,
  hasUpVote,
  hasDownVote
}: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()


  const handleVote = (type: 'upvote' | 'downvote') => {
    if (session.status !== 'authenticated') return toast.success('Please Login To Vote', {
      description: "Only logged in users can vote"
    })

    try {
      setIsLoading(true)
      const successMessage = type === 'upvote' ? `Upvote ${hasUpVote ? 'canceled' : 'added'} Successfully` : `Downvote ${hasDownVote ? 'canceled' : 'added'} Successfully`

      // TODO: call the vote server action

      return toast.success('Successful', {
        description: successMessage
      })
    } catch (error) {
      return toast.error('Failed to vote.', {
        description: 'Something went wrong. Please try again later.'
      })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className='flex-center gap-2.5'>
      <div className='flex-center gap-1.5'>
        <>
          <Icon className={`w-4.5 h-4.5 cursor-pointer ${hasUpVote && 'text-green-300'} ${isLoading && 'opacity-50'}`} icon={hasUpVote ? 'bxs:upvote' : 'bx:upvote'} onClick={() => handleVote('upvote')} />
          <div className='flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatCount(upvotes)}
            </p>
          </div>
        </>
        <>
          <Icon className={`w-4.5 h-4.5 cursor-pointer ${hasDownVote && 'text-red-300'} ${isLoading && 'opacity-50'}`} icon={hasDownVote ? 'bxs:downvote' : 'bx:downvote'} onClick={() => handleVote('downvote')} />
          <div className='flex-center background-light700_dark400 min-w-5 rounded-sm p-1'>
            <p className='subtle-medium text-dark400_light900'>
              {formatCount(downvotes)}
            </p>
          </div>
        </>

      </div>
    </div>
  )
}

export default Votes
