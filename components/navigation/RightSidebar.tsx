import { Icon } from '@iconify/react'
import Link from 'next/link'
import * as React from 'react'

import TagCard from '@/components/cards/TagCard'

// TODO: Replace Static data with api data
const hotQuestions: Array<{
  _id: string
  title: string
}> = [
  {
    _id: '1',
    title: 'how to create a custom hook in react ohohoh?',
  },
  {
    _id: '2',
    title: 'how to learn java',
  },
  {
    _id: '3',
    title: 'how to learn redux',
  },
  {
    _id: '4',
    title: 'how to learn rust',
  },
]

const popularTags: Array<{
  _id: string
  name: string
  questions: number
}> = [
  {
    _id: '1',
    name: 'react',
    questions: 10,
  },
  {
    _id: '2',
    name: 'redux',
    questions: 10,
  },
  {
    _id: '3',
    name: 'javascript',
    questions: 100,
  },
  {
    _id: '4',
    name: 'typescript',
    questions: 100,
  },
  {
    _id: '5',
    name: 'next.js',
    questions: 1000,
  },
]

const RightSidebar = () => {
  return (
    <section className='custom-scrollbar background-light900_dark200 light-border shadow-light-300 sticky top-0 right-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-t border-l p-6 pt-36 max-xl:hidden dark:shadow-none'>
      {/* Hot Questions */}
      <div>
        <h3 className='h3-bold text-dark200_light900'>Top Questions</h3>
        <div className='mt-7 flex w-full flex-col gap-[30px]'>
          {hotQuestions.map(question => {
            return (
              <Link
                key={question._id}
                href={`/profile/${question._id}`}
                className='flex cursor-pointer items-center justify-between gap-7 transition-all hover:translate-x-1 hover:opacity-70'
              >
                <p className='body-medium text-dark500_light700'>{question.title}</p>
                <Icon icon='weui:arrow-filled' className='h-5 w-5' />
              </Link>
            )
          })}
        </div>
      </div>

      {/*  Popular Tags */}
      <div className='mt-16'>
        <h3 className='h3-bold text-dark200_light900'>Popular Tags</h3>
        <div className='mt-7 flex flex-col gap-4'>
          {popularTags.map(tag => (
            <TagCard
              key={tag._id}
              _id={tag._id}
              name={tag.name}
              questions={tag.questions}
              showCount
              compact
            />
          ))}
        </div>
      </div>
    </section>
  )
}

export default RightSidebar
