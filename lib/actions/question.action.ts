'use server'

import mongoose from 'mongoose'

import Question from '@/database/question.model'
import TagQuestion from '@/database/tag-question.model'
import Tag from '@/database/tag.model'
import { CreateQuestionParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { AskQuestionSchema } from '../validation'

export const createQuestion = async (params: CreateQuestionParams): Promise<ActionResponse> => {
  const result = await action({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  })

  if (result instanceof Error) {
    return handleError(result, 'server') as ErrorResponse
  }

  const { title, content, tags } = result.params!
  const userId = result.session?.user?.id
  // we will create both tags and question record, so we need to ensure
  // the consistency of the two operations, so we need to use a transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // create the question
    const [question] = await Question.create([
      {
        title,
        content,
        author: userId,
      },
      {
        session,
      },
    ])

    if (!question) {
      throw new Error('Failed to create question')
    }

    const tagIds: mongoose.Types.ObjectId[] = []
    const tagQuestionDocuments = []
    for (const tag of tags) {
      // Find or create a tag with case-insensitive matching
      // - Uses regex with 'i' flag to match tag name case-insensitively
      // - $setOnInsert: Only sets the 'name' field when creating a new tag (on insert)
      // - $inc: Increments the 'questions' counter by 1 for both existing and new tags
      // - upsert: true - Creates a new tag if no match is found
      // - new: true - Returns the modified/created document instead of the original
      // - session: Ensures this operation is part of the transaction
      const existingTag = await Tag.findOneAndUpdate(
        {
          name: { $regex: new RegExp(`^${tag}$`, 'i') },
        },
        {
          $setOnInsert: { name: tag },
          $inc: { questions: 1 },
        },
        {
          new: true,
          upsert: true,
          session,
        }
      )
      tagIds.push(existingTag._id)
      tagQuestionDocuments.push({
        tag: existingTag._id,
        question: question._id,
      })
    }
    // relate the question to the tags
    await TagQuestion.insertMany(tagQuestionDocuments, { session })
    // update question
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session }
    )

    await session.commitTransaction()

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    }
  } catch (error) {
    session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    session.endSession()
  }
}
