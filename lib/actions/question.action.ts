'use server'

import mongoose from 'mongoose'

import Question from '@/database/question.model'
import TagQuestion from '@/database/tag-question.model'
import Tag from '@/database/tag.model'
import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { AskQuestionSchema, EditQuestionSchema, GetQuestionSchema } from '../validation'

export const createQuestion = async (
  params: CreateQuestionParams
): Promise<ActionResponse<Question>> => {
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
    const [question] = await Question.create(
      [
        {
          title,
          content,
          author: userId,
        },
      ],
      {
        session,
      }
    )

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
    await session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export const editQuestion = async (
  params: EditQuestionParams
): Promise<ActionResponse<Question>> => {
  const result = await action({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  })

  if (result instanceof Error) {
    return handleError(result, 'server') as ErrorResponse
  }

  const { title, content, tags, questionId } = result.params!
  const userId = result.session?.user?.id
  // we will create both tags and question record, so we need to ensure
  // the consistency of the two operations, so we need to use a transaction
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // get the question by id
    const question = await Question.findById(questionId).populate('tags')

    if (!question) {
      throw new Error('The question is not exist')
    }

    // check the author
    if (question.author.toString() !== userId) {
      throw new Error('You are not authorized to edit this question')
    }

    if (question.title !== title || question.content !== content) {
      question.title = title
      question.content = content
      await question.save({ session })
    }

    const tagsToAdd = tags.filter(
      tag =>
        !question.tags?.map((tag: any) => tag.name.toLocaleLowerCase())?.includes(tag.toLowerCase())
    )

    const tagsToRemove = question.tags?.filter(
      t => !tags.map(tag => tag.toLowerCase())?.includes((t as any).name.toLowerCase())
    )

    const newTagQuestionDocuments = []
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
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

        newTagQuestionDocuments.push({
          tag: existingTag._id,
          question: questionId,
        })
        question?.tags?.push(existingTag._id)
      }
    }

    if (tagsToRemove && tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove?.map(tag => tag._id)
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      )

      // unrelated the tag from the question
      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session }
      )

      // remove the tag from the question
      question.tags = question.tags?.filter(
        tag => !tagIdsToRemove.some(removeId => removeId.equals(tag._id))
      )
    }

    if (newTagQuestionDocuments.length > 0) {
      await TagQuestion.insertMany(newTagQuestionDocuments, { session })
    }

    await question.save({ session })
    await session.commitTransaction()

    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    }
  } catch (error) {
    await session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export const getQuestion = async (params: GetQuestionParams): Promise<ActionResponse<Question>> => {
  const result = await action({
    params,
    schema: GetQuestionSchema,
  })

  if (result instanceof Error) {
    return handleError(result, 'server') as ErrorResponse
  }

  const { questionId } = result.params!

  try {
    const question = await Question.findById(questionId).populate('tags')
    if (!question) {
      throw new Error('The question is not exist')
    }
    return {
      success: true,
      data: JSON.parse(JSON.stringify(question)),
    }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
