// 'use client'

import Link from 'next/link'
import * as React from 'react'

import TagCard from '@/components/cards/TagCard'
import Metric from '@/components/Metric'
import ROUTES from '@/constants/routes'
import { IQuestionAuthorPopulated, IQuestionTagPopulated } from '@/database/question.model'
import { getTimeStamp } from '@/lib/utils'

import UserAvatar from '../UserAvatar'


type Props = {
  question: IQuestionTagPopulated & IQuestionAuthorPopulated
}
const QuestionCard = ({ question }: Props) => {
  return (
    <div className='card-wrapper hover:shadow-primary-500/10 dark:hover:shadow-primary-500/20 cursor-pointer rounded-[10px] p-9 transition-all duration-300 hover:shadow-2xl sm:px-11'>
      <div className='flex flex-col-reverse items-start justify-between gap-5 sm:flex-row'>
        <div>
          <span className='text-dark400_light700 line-clamp-1 flex text-sm sm:hidden'>
            {getTimeStamp(new Date(question.createdAt))}
          </span>

          <Link href={ROUTES.QUESTION(question._id.toString())}>
            <h3 className='text-dark200_light900 hover:text-primary-500 line-clamp-1 flex-1 text-lg font-semibold transition-colors duration-200 sm:text-xl'>
              {question.title}
            </h3>
          </Link>
        </div>
      </div>

      <div className='mt-3.5 flex w-full flex-wrap gap-2'>
        {question.tags.map(tag => {
          const tagIdString = {
            ...tag,
            _id: tag._id.toString(),
          }
          return <TagCard compact key={tag._id.toString()} {...tagIdString} />
        })}
      </div>

      <div className='flex-between mt-6 flex w-full flex-wrap gap-3'>
        {/* Author */}
        <div className='flex items-center gap-2'>
          <UserAvatar id={question.author._id.toString()} name={question.author.name} imageUrl={question.author.avatar} className='size-7.5!' />
          <Link href={ROUTES.PROFILE(question.author._id.toString())}>
            <span className='text-dark400_light700 hover:text-primary-500 text-sm font-medium transition-colors duration-200'>
              {question.author.name}
            </span>
          </Link>
          <span className='text-dark400_light700 text-sm max-sm:hidden'>
            • asked {getTimeStamp(new Date(question.createdAt))}
          </span>
        </div>
        {/*  Metrices */}
        <div className='flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start'>
          <Metric icon='iconamoon:like-light' count={question.upvotes} type='Votes' />
          <Metric icon='mynaui:message' count={question.answers} type='Answers' />
          <Metric icon='mdi-light:eye' count={question.views} type='Views' />
        </div>
      </div>
    </div>
  )
}

export default QuestionCard
