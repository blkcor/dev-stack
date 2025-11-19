'use server'

import mongoose, { FilterQuery } from 'mongoose'

import Question, {
  IQuestionAuthorPopulated,
  IQuestionDoc,
  IQuestionTagPopulated,
} from '@/database/question.model'
import TagQuestion from '@/database/tag-question.model'
import Tag from '@/database/tag.model'
import { CreateQuestionParams, EditQuestionParams, GetQuestionParams } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
  PaginatedQueryParamsSchema,
} from '../validation'

export const createQuestion = async (
  params: CreateQuestionParams
): Promise<ActionResponse<IQuestionDoc>> => {
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
): Promise<ActionResponse<IQuestionDoc>> => {
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
    // get the question by id with populated tags
    const question = (await Question.findById(questionId)
      .populate('tags')
      .session(session)) as IQuestionTagPopulated | null

    if (!question) {
      throw new Error('The question is not exist')
    }

    // check the author
    if (question.author.toString() !== userId) {
      throw new Error('You are not authorized to edit this question')
    }

    // Update title and content if changed
    if (question.title !== title || question.content !== content) {
      await Question.findByIdAndUpdate(questionId, { title, content }, { session })
    }

    // Get existing tag names in lowercase
    const existingTagNames = question.tags.map(tag => tag.name.toLowerCase())

    // Find tags to add
    const tagsToAdd = tags.filter(tag => !existingTagNames.includes(tag.toLowerCase()))

    // Find tags to remove
    const tagsToRemove = question.tags.filter(
      tag => !tags.map(t => t.toLowerCase()).includes(tag.name.toLowerCase())
    )

    // Handle tags to remove
    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map(tag => tag._id)

      // Decrement question count for removed tags
      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session }
      )

      // Remove TagQuestion relationships
      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session }
      )

      // Remove tags from question
      await Question.findByIdAndUpdate(
        questionId,
        { $pull: { tags: { $in: tagIdsToRemove } } },
        { session }
      )
    }

    // Handle tags to add
    if (tagsToAdd.length > 0) {
      const newTagIds: mongoose.Types.ObjectId[] = []
      const newTagQuestionDocuments = []

      for (const tag of tagsToAdd) {
        // Find or create a tag with case-insensitive matching
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

        newTagIds.push(existingTag._id)
        newTagQuestionDocuments.push({
          tag: existingTag._id,
          question: questionId,
        })
      }

      // Create TagQuestion relationships
      await TagQuestion.insertMany(newTagQuestionDocuments, { session })

      // Add tags to question
      await Question.findByIdAndUpdate(
        questionId,
        { $push: { tags: { $each: newTagIds } } },
        { session }
      )
    }

    await session.commitTransaction()

    // Fetch the updated question
    const updatedQuestion = await Question.findById(questionId).populate('tags')

    return {
      success: true,
      data: JSON.parse(JSON.stringify(updatedQuestion)),
    }
  } catch (error) {
    await session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export const getQuestion = async (
  params: GetQuestionParams
): Promise<ActionResponse<IQuestionDoc>> => {
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

export const getQuestions = async (
  params: PaginatedQueryParams
): Promise<
  ActionResponse<{
    questions: Array<IQuestionAuthorPopulated & IQuestionTagPopulated>
    isNext: boolean
  }>
> => {
  const validatedResult = await action({
    params,
    schema: PaginatedQueryParamsSchema,
  })
  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { page = 1, pageSize = 10, query, filter } = validatedResult.params!
  const skip = (page - 1) * pageSize
  const limit = pageSize

  const filterQuery: FilterQuery<typeof Question> = {}

  // TODO: Implement the recommended query logic later
  if (filter === 'recommended') {
    return { success: true, data: { questions: [], isNext: false } }
  }

  if (query) {
    filterQuery.$or = [
      { title: { $regex: query, $options: 'i' } },
      { content: { $regex: query, $options: 'i' } },
    ]
  }

  let sortCriteria = {}

  // fill the sortCriteria by the filter
  switch (filter) {
    case 'newest':
      sortCriteria = { createdAt: -1 }
      break
    case 'unanswered':
      filterQuery.answers = 0
      sortCriteria = { createdAt: -1 }
      break
    case 'popular':
      sortCriteria = { upvotes: -1 }
      break
    default:
      sortCriteria = { upvotes: -1 }
  }
  try {
    const totalQuestions = await Question.countDocuments(filterQuery)

    const questions = await Question.find(filterQuery)
      .populate('tags', 'name')
      .populate('author')
      .lean()
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit)
    const isNext = questions.length + skip < totalQuestions

    return {
      success: true,
      data: { questions: JSON.parse(JSON.stringify(questions)), isNext },
    }
  } catch (err) {
    return handleError(err, 'server') as ErrorResponse
  }
}
