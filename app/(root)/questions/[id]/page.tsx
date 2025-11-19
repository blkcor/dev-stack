

import { Icon } from '@iconify/react'
import Link from 'next/link'
import React, { use } from 'react'

import Metric from '@/components/Metric'
import UserAvatar from '@/components/UserAvatar'
import ROUTES from '@/constants/routes'
import { getTimeStamp } from '@/lib/utils'


const QuestionDetails = ({ params }: RouteParam) => {
  const { id } = use(params)
  console.log(id)
  // const { data, success } = use(getQuestion({ questionId: id }))
  return (
    <>
      <div className='flex-start w-full flex-col'>
        <div className='flex w-full flex-col-reverse justify-between'>
          <div className='flex items-center justify-start gap-1'>
            {/*  TODO: replace with the backend data */}
            <UserAvatar id='1' name='blkcor' imageUrl={"https://avatar.iran.liara.run/public"} className='size-22' fallbackClassName="text-2.5" />
            <Link href={ROUTES.PROFILE('1')}>
              <p className='paragraph-semibold text-dark300_light700'>blkcor</p>
            </Link>
          </div>

          <div className='flex justify-end'>
            <p>Votes</p>
          </div>
        </div>

        <h2 className='h2-semibold text-dark200_light800 mt-3.5 w-full'>
          test title
        </h2>
      </div>

      <div className='mb-8 mt-5 flex flex-wrap gap-4'>
        <div className='flex cursor-pointer items-center gap-1.5 transition-all duration-200'>
          <Icon
            icon='mdi:clock'
            className='text-dark300_light900 hover:text-primary-500 h-5 w-5 transition-colors duration-200'
          />
          <span className='text-dark400_light800 text-sm font-medium max-sm:hidden'>
            asked {getTimeStamp(new Date())}
          </span>
        </div>
        <Metric icon='mynaui:message' count={300021} type='Answers' />
        <Metric icon='mdi-light:eye' count={1234} type='Views' />
      </div>

      <p className='text-dark400_light800'>Preview Content</p>

      {/* TODO: render the tags list */}
      <div className='mt-8 flex flex-wrap gap-2'>
        <span className='text-dark400_light800 text-sm font-medium'>#tag</span>
      </div>
    </>
  )
}

export default QuestionDetails
