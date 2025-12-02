'use server'

import mongoose, { ClientSession } from 'mongoose'

import Answer from '@/database/answer.model'
import Question from '@/database/question.model'
import Vote from '@/database/vote.model'
import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteParams,
} from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { CreateVoteSchema, HasVotedSchema, UpdateVoteSchema } from '../validation'

export const createVote = async (params: CreateVoteParams): Promise<ActionResponse> => {
  const validatedResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { itemId, itemType, voteType } = validatedResult.params!
  const userId = validatedResult.session?.user?.id

  if (!userId) return handleError('Unauthorized', 'server') as ErrorResponse

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      type: itemType,
      voteType,
    })

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        // if the use hav already vote with the same vote type, remove it
        await Vote.deleteOne({
          _id: existingVote._id,
        }).session(session)

        await updateVote(
          {
            itemId,
            itemType,
            voteType,
            change: -1,
          },
          session
        )
      } else {
        await Vote.findByIdAndUpdate(existingVote._id, { voteType }, { new: true, session })
        await updateVote(
          {
            itemId,
            itemType,
            voteType,
            change: 1,
          },
          session
        )
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            id: itemId,
            type: itemType,
            voteType,
          },
        ],
        {
          session,
        }
      )

      await updateVote(
        {
          itemId,
          itemType,
          voteType,
          change: 1,
        },
        session
      )
    }

    await session.commitTransaction()

    return { success: true }
  } catch (error) {
    session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    session.endSession()
  }
}

export const updateVote = async (
  params: UpdateVoteParams,
  session: ClientSession
): Promise<ActionResponse> => {
  const validatedResult = await action({
    params,
    schema: UpdateVoteSchema,
    authorize: true,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { itemType, voteType, change, itemId } = validatedResult.params!

  const voteField = voteType === 'upvote' ? 'upvotes' : 'downvotes'

  try {
    const updateQuery = { $inc: { [voteField]: change } }
    const options = { new: true, session }

    let result
    if (itemType === 'question') {
      result = await Question.findByIdAndUpdate(itemId, updateQuery, options)
    } else {
      result = await Answer.findByIdAndUpdate(itemId, updateQuery, options)
    }

    if (!result) {
      return handleError(new Error('Failed to update vote count')) as ErrorResponse
    }

    return {
      success: true,
    }
  } catch (error) {
    await session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  }
}

export const hasVoted = async (
  params: HasVotedParams
): Promise<ActionResponse<HasVotedResponse>> => {
  const validatedResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  })
  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { itemId, itemType } = validatedResult.params!
  const userId = validatedResult.session?.user?.id

  try {
    const vote = await Vote.findOne({ author: userId, type: itemType, id: itemId })
    if (!vote) {
      return {
        success: true,
        data: {
          hasDownvoted: false,
          hasUpvoted: false,
        },
      }
    }

    return {
      success: true,
      data: {
        hasDownvoted: vote.voteType === 'downvote',
        hasUpvoted: vote.voteType === 'upvote',
      },
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
