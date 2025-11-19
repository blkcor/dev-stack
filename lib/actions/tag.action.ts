'use server'

import { FilterQuery } from 'mongoose'

import Question, { PickedQuestion } from '@/database/question.model'
import Tag, { ITagDoc } from '@/database/tag.model'
import { TagQuestionsParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { NotFoundError } from '../http-errors'
import { PaginatedQueryParamsSchema, TagQuestionSchema } from '../validation'

export const getTags = async (
  params: PaginatedQueryParams
): Promise<
  ActionResponse<{
    tags: ITagDoc[]
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

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!

  const skip = (page - 1) * pageSize
  const limit = pageSize

  const filterQuery: FilterQuery<typeof Tag> = {}

  if (query) {
    filterQuery.name = { $regex: query, $options: 'i' }
  }
  let sortCriteria = {}

  switch (filter) {
    case 'name':
      sortCriteria = { name: 1 }
      break
    case 'recent':
      sortCriteria = { createdAt: -1 }
      break
    case 'oldest':
      sortCriteria = { createdAt: 1 }
      break
    case 'popular':
      sortCriteria = { questions: -1 }
      break
    default:
      sortCriteria = { name: 1 }
      break
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery)
    const tags = await Tag.find(filterQuery).skip(skip).limit(limit).sort(sortCriteria)
    const isNext = skip + tags.length < totalTags

    return {
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    }
  } catch (err) {
    return handleError(err, 'server') as ErrorResponse
  }
}

export const getTagQuestions = async (
  params: TagQuestionsParams
): Promise<
  ActionResponse<{
    tag: ITagDoc
    questions: Array<PickedQuestion>
    isNext: boolean
  }>
> => {
  const validatedResult = await action({
    params,
    schema: TagQuestionSchema,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { page = 1, pageSize = 10, tagId, query } = validatedResult.params!

  try {
    const tag = await Tag.findById(tagId)

    if (!tag) throw new NotFoundError('Tag not found')

    const filterQuery: FilterQuery<typeof Question> = {
      tags: { $in: [tagId] },
    }

    if (query) {
      filterQuery.title = { $regex: query, $options: 'i' }
    }

    const totalQuestions = await Question.countDocuments(filterQuery)
    const skip = (page - 1) * pageSize
    const limit = pageSize

    const questions = await Question.find(filterQuery)
      .select('_id title views answer upvotes downvotes author createdAt')
      .populate([
        {
          path: 'author',
          select: 'name avatar',
        },
        {
          path: 'tags',
          select: 'name',
        },
      ])
      .skip(skip)
      .limit(limit)

    const isNext = totalQuestions > skip + questions.length
    return {
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    }
  } catch (err) {
    return handleError(err, 'server') as ErrorResponse
  }
}
