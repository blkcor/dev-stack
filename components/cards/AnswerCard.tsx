import Link from 'next/link'
import React, { Suspense } from 'react'

import MDXPreview from '@/components/editor/preview'
import UserAvatar from '@/components/UserAvatar'
import ROUTES from '@/constants/routes'
import { IAnswerAuthorPopulated } from '@/database/answer.model'
import { hasVoted } from '@/lib/actions/vote.action'
import { getTimeStamp } from '@/lib/utils'

import Votes from '../votes/Votes'

interface AnswerCardProps {
  answer: IAnswerAuthorPopulated
}

const AnswerCard = ({ answer }: AnswerCardProps) => {
  const hasVotedPromise = hasVoted({
    itemId: answer._id,
    itemType: 'answer'
  })
  return (
    <article className='card-wrapper rounded-[10px] px-5 py-8 sm:px-9 sm:py-9 mb-6'>
      <span id={answer._id} className='hash-span' />

      <div className='mb-5 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <div className='flex flex-1 items-start sm:items-center gap-1'>
          <UserAvatar
            id={answer.author._id.toString()}
            name={answer.author.name}
            imageUrl={answer.author.avatar}
            className='size-5 rounded-full object-cover max-sm:mt-0.5'
          />
          <Link href={ROUTES.PROFILE(answer.author._id.toString())} className='flex flex-col sm:flex-row sm:items-center max-sm:ml-1'>
            <p className='text-dark300_light700 body-semibold'>{answer.author.name ?? 'Anonymous'}</p>
            <p className='small-regular text-light-400_light500 ml-0.5 mt-0.5 line-clamp-1'>
              <span className='max-sm:hidden'>•</span>
              answered {getTimeStamp(new Date(answer.createdAt))}
            </p>
          </Link>
        </div>

        <div className='flex justify-end'>
          <Suspense fallback={<div>Loading...</div>}>
            <Votes upvotes={answer.upvotes} downvotes={answer.downvotes} itemType='answer' itemId={answer._id} hasVoted={hasVotedPromise} />
          </Suspense>
        </div>
      </div>
      <MDXPreview content={answer.content} />
    </article>
  )
}

export default AnswerCard
