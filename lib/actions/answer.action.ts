'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'

import ROUTES from '@/constants/routes'
import Answer, { IAnswerDoc } from '@/database/answer.model'
import Question from '@/database/question.model'
import { CreateAnswerParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { CreateAnswerSchema } from '../validation'

export const createAnswer = async (
  params: CreateAnswerParams
): Promise<ActionResponse<IAnswerDoc>> => {
  const validatedResult = await action({
    params,
    schema: CreateAnswerSchema,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { questionId, content } = validatedResult.params!
  const userID = validatedResult.session?.user?.id

  // start a transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // find the question and increase the answer count
    const question = await Question.findById(questionId)
    if (!question) {
      throw new Error('Question not found')
    }

    // create the answer
    const [newAnswer] = await Answer.create(
      [
        {
          question: questionId,
          content,
          author: userID,
        },
      ],
      {
        session,
      }
    )

    if (!newAnswer) throw new Error('Answer creation failed')
    question.answers += 1
    await question.save({ session })

    await session.commitTransaction()
    revalidatePath(ROUTES.QUESTION(questionId))

    return {
      success: true,
      data: JSON.parse(JSON.stringify(newAnswer)),
    }
  } catch (err) {
    await session.abortTransaction()
    return handleError(err, 'server') as ErrorResponse
  }
}
