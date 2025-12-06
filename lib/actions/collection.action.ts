'use server'

import mongoose, { PipelineStage } from 'mongoose'
import { revalidatePath } from 'next/cache'

import ROUTES from '@/constants/routes'
import Collection, { ICollectionAuthorQuestionPopulated } from '@/database/collection.model'
import Question from '@/database/question.model'
import { CollectionBaseParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { CollectionBaseSchema, PaginatedQueryParamsSchema } from '../validation'

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

      revalidatePath(ROUTES.QUESTION(questionId))
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

export const hasSaveQuestion = async (
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

    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    })

    return {
      success: true,
      data: {
        saved: !!collection,
      },
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}

export const getSavedQuestions = async (
  params: PaginatedQueryParams
): Promise<
  ActionResponse<{
    collections: ICollectionAuthorQuestionPopulated[]
    isNext: boolean
  }>
> => {
  const validatedResult = await action({
    params,
    schema: PaginatedQueryParamsSchema,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { page = 1, pageSize = 10, sort, query } = validatedResult.params!
  const skip = (page - 1) * pageSize
  const limit = pageSize
  const userId = validatedResult.session?.user?.id

  const sortOptions: Record<string, Record<string, 1 | -1>> = {
    mostrecent: { 'question.createdAt': -1 },
    oldest: { 'question.createdAt': 1 },
    mostvoted: { 'question.upvotes': -1 },
    mostviewed: { 'question.views': -1 },
    mostanswered: { 'question.answers': -1 },
  }

  const sortCriteria = sortOptions[sort as keyof typeof sortOptions] || {
    'question.createdAt': -1,
  }

  const pipeline: PipelineStage[] = [
    {
      $match: { author: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: 'questions',
        localField: 'question',
        foreignField: '_id',
        as: 'question',
      },
    },
    {
      $unwind: '$question',
    },
    {
      $lookup: {
        from: 'users',
        localField: 'question.author',
        foreignField: '_id',
        as: 'question.author',
      },
    },
    {
      $unwind: '$question.author',
    },
    {
      $lookup: {
        from: 'tags',
        localField: 'question.tags',
        foreignField: '_id',
        as: 'question.tags',
      },
    },
  ]

  try {
    if (query) {
      pipeline.push({
        $match: {
          $or: [
            {
              'question.title': { $regex: query, $options: 'i' },
              'question.content': { $regex: query, $options: 'i' },
            },
          ],
        },
      })
    }

    const [totalCount] = await Collection.aggregate([...pipeline, { $count: 'count' }])

    pipeline.push(
      {
        $sort: sortCriteria,
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      }
    )

    pipeline.push({
      $project: {
        question: 1,
        author: 1,
      },
    })
    const questions = await Collection.aggregate(pipeline)

    const isNext = totalCount > skip + limit

    return {
      success: true,
      data: {
        collections: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
