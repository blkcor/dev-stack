'use server'

import { FilterQuery } from 'mongoose'

import User, { IUser } from '@/database/user.model'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { PaginatedQueryParamsSchema } from '../validation'

export const getAllUsers = async (
  params: PaginatedQueryParams
): Promise<
  ActionResponse<{
    users: IUser[]
    isNext: boolean
  }>
> => {
  const validatedResult = await action({
    params,
    schema: PaginatedQueryParamsSchema,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult) as ErrorResponse
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!

  const skip = (page - 1) * pageSize

  const filterQuery: FilterQuery<IUser> = {}

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { email: { $regex: query, $options: 'i' } },
    ]
  }

  let sortCriteria = {}

  switch (filter) {
    case 'newest':
      sortCriteria = { createdAt: -1 }
      break
    case 'oldest':
      sortCriteria = { createdAt: 1 }
      break
    case 'popular':
      sortCriteria = { reputation: 1 }
      break
    default:
      sortCriteria = { createdAt: -1 }
      break
  }

  try {
    const totalUsers = await User.countDocuments(filterQuery)
    const users = await User.find(filterQuery).sort(sortCriteria).skip(skip).limit(pageSize)
    const isNext = users.length + skip < totalUsers

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
