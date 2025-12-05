'use server'

import { revalidatePath } from 'next/cache'

import ROUTES from '@/constants/routes'
import Collection from '@/database/collection.model'
import Question from '@/database/question.model'
import { CollectionBaseParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { CollectionBaseSchema } from '../validation'

export const toggleSaveQuestion = async (
  params: CollectionBaseParams
): Promise<
  ActionResponse<{
    saved: boolean
  }>
> => {
  const validatedResult = await action({
    schema: CollectionBaseSchema,
    params,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { questionId } = validatedResult.params!
  const userId = validatedResult.session?.user?.id

  try {
    const question = await Question.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    // find if the collection is already created
    const existingCollection = await Collection.findOne({
      author: userId,
      question: questionId,
    })

    if (existingCollection) {
      await Collection.findByIdAndDelete(existingCollection._id)

      return {
        success: true,
        data: { saved: false },
      }
    }

    await Collection.create({
      author: userId,
      question: questionId,
    })

    revalidatePath(ROUTES.QUESTION(questionId))
    return {
      status: 201,
      success: true,
      data: {
        saved: true,
      },
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
