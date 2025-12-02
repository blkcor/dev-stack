'use client'

import { Icon } from '@iconify/react'
import { useSession } from 'next-auth/react'
import React, { useState } from 'react'
import { toast } from 'sonner'

import { createVote } from '@/lib/actions/vote.action'
import { formatCount } from '@/lib/utils'

interface Props {
  upvotes: number
  downvotes: number
  hasUpVote: boolean
  hasDownVote: boolean
  itemType: 'question' | 'answer'
  itemId: string
}
const Votes = ({ upvotes, downvotes, hasUpVote, hasDownVote, itemType, itemId }: Props) => {
  const [isLoading, setIsLoading] = useState(false)
  const session = useSession()

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    if (session.status !== 'authenticated') {
      return toast.success('Please Login To Vote', {
        description: 'Only logged in users can vote',
      })
    }

    setIsLoading(true)
    try {
      const res = await createVote({
        itemId,
        itemType,
        voteType,
      })

      if (!res.success) {
        return toast.error('Failed to vote.', {
          description: res.error,
        })
      }

      const successMessage =
        voteType === 'upvote'
          ? `Upvote ${hasUpVote ? 'canceled' : 'added'} Successfully`
          : `Downvote ${hasDownVote ? 'canceled' : 'added'} Successfully`
      return toast.success('Successful', {
        description: successMessage,
      })
    } catch {
      return toast.error('Failed to vote.', {
        description: 'Something went wrong. Please try again later.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-center gap-2.5">
      <div className="flex-center gap-1.5">
        <>
          <Icon
            className={`w-4.5 h-4.5 cursor-pointer ${hasUpVote && 'text-green-300'} ${isLoading && 'opacity-50'
              }`}
            icon={hasUpVote ? 'bxs:upvote' : 'bx:upvote'}
            onClick={() => handleVote('upvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{formatCount(upvotes)}</p>
          </div>
        </>
        <>
          <Icon
            className={`w-4.5 h-4.5 cursor-pointer ${hasDownVote && 'text-red-300'} ${isLoading && 'opacity-50'
              }`}
            icon={hasDownVote ? 'bxs:downvote' : 'bx:downvote'}
            onClick={() => handleVote('downvote')}
          />
          <div className="flex-center background-light700_dark400 min-w-5 rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">{formatCount(downvotes)}</p>
          </div>
        </>
      </div>
    </div>
  )
}

export default Votes

