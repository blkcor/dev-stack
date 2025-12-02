
import { Icon } from '@iconify/react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { after } from 'next/server'
import React from 'react'


import { auth } from '@/auth'
import AllAnswers from '@/components/answers/AllAnswers'
import TagCard from '@/components/cards/TagCard'
import MDXPreview from '@/components/editor/preview'
import AnswerForm from '@/components/forms/AnswerForm'
import Metric from '@/components/Metric'
import UserAvatar from '@/components/UserAvatar'
import Votes from '@/components/votes/Votes'
import ROUTES from '@/constants/routes'
import { ITagDoc } from '@/database/tag.model'
import { getAnswers } from '@/lib/actions/answer.action'
import { getQuestion, incrementViews } from '@/lib/actions/question.action'
import { getTimeStamp } from '@/lib/utils'

const QuestionDetails = async ({ params }: RouteParam) => {
  const { id } = await params
  const session = await auth()
  const userId = session?.user?.id

  after(async () => {
    await incrementViews({ questionId: id })
  })

  const { data, success } = await getQuestion({ questionId: id })

  if (!data || !success) {
    return redirect('/404')
  }

  const {
    success: isAnswerLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: id,
    pageSize: 10,
    page: 1,
    sort: 'latest',
  })

  const { _id, name, avatar } = data.author

  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={_id.toString()}
              name={name}
              imageUrl={avatar}
              className="size-5.5"
              fallbackClassName="text-2.5"
            />
            <Link href={ROUTES.PROFILE(_id.toString())}>
              <p className="paragraph-semibold text-dark300_light700">{name}</p>
            </Link>
          </div>

          <div className="flex justify-end">
            <Votes
              itemType="question"
              itemId={data._id.toString()}
              upvotes={data.upvotes}
              downvotes={data.downvotes}
              hasUpVote={userId ? data.upvotes.includes(userId) : false}
              hasDownVote={userId ? data.downvotes.includes(userId) : false}
            />
          </div>
        </div>

        <h2 className="h2-semibold text-dark200_light800 mt-3.5 w-full">{data.title}</h2>
      </div>

      <div className="mt-5 mb-8 flex flex-wrap gap-4">
        <div className="flex cursor-pointer items-center gap-1.5 transition-all duration-200">
          <Icon
            icon="mdi:clock"
            className="text-dark300_light900 hover:text-primary-500 h-5 w-5 transition-colors duration-200"
          />
          <span className="text-dark400_light800 text-sm font-medium max-sm:hidden">
            asked {getTimeStamp(new Date(data.createdAt))}
          </span>
        </div>
        <Metric icon="mynaui:message" count={data.answers} type="Answers" />
        <Metric icon="mdi-light:eye" count={data.views} type="Views" />
      </div>

      <MDXPreview content={data.content} />

      <div className="mt-8 flex flex-wrap gap-2">
        <span className="text-dark400_light800 text-sm font-medium">
          <div className="mt-3.5 flex w-full flex-wrap gap-2">
            {data.tags.map((tag: ITagDoc) => {
              return (
                <TagCard
                  compact
                  key={tag._id.toString()}
                  _id={tag._id.toString()}
                  name={tag.name}
                  questions={tag.questions}
                />
              )
            })}
          </div>
        </span>
      </div>

      <section className="mt-5">
        <AllAnswers
          data={answersResult?.answers}
          success={isAnswerLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers}
        />
      </section>

      <section className="mt-5">
        <AnswerForm questionId={id} questionTitle={data.title} questionContent={data.content} />
      </section>
    </>
  )
}

export default QuestionDetails
