'use server'

import { FilterQuery } from 'mongoose'

import Tag, { ITagDoc } from '@/database/tag.model'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { PaginatedQueryParamsSchema } from '../validation'

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
