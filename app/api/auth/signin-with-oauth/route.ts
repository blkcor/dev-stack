import mongoose from 'mongoose'
import { NextRequest, NextResponse } from 'next/server'
import slugify from 'slugify'
import { z } from 'zod'

import Account from '@/database/account.model'
import User from '@/database/user.model'
import { handleError } from '@/lib/handlers/error'
import { ValidationError } from '@/lib/http-errors'
import { logger } from '@/lib/logger'
import dbConnect from '@/lib/mongoose'
import { SignInWithOAuthSchema } from '@/lib/validation'

export const POST = async (req: NextRequest) => {
  const { provider, providerAccountId, user } = await req.json()

  await dbConnect()
  // create a mongodb transaction with mongoose
  // ensure the consistence of  multi operations
  // if we try to create an account => FAILS
  // we create a user => FAILS
  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    // validate and parse the json parameters
    const validateData = SignInWithOAuthSchema.safeParse({
      provider,
      providerAccountId,
      user,
    })

    logger.debug(`provider: ${provider}, providerAccountId: ${providerAccountId}`)

    // parse failed
    if (!validateData.success)
      throw new ValidationError(z.flattenError(validateData.error).fieldErrors)

    const { name, username, avatar, email } = validateData.data.user
    // deal with the username because it contains some invalid content like: _ <space> * and so on
    const slugifiedUsername = slugify(username, {
      lower: true,
      strict: true,
      trim: true,
    })
    let existingUser = await User.findOne({ email }).session(session)
    // if the user is not exist, we need to create the user first
    if (!existingUser) {
      ;[existingUser] = await User.create(
        [
          {
            name,
            username: slugifiedUsername,
            email,
            avatar,
          },
        ],
        { session }
      )

      // check if the account exist
      // if not, create the account
      const existingAccount = await Account.findOne({
        userId: existingUser._id,
        provider,
        providerAccountId,
      }).session(session)
      if (!existingAccount) {
        await Account.create(
          [
            {
              userId: existingUser._id,
              name,
              avatar,
              provider,
              providerAccountId,
            },
          ],
          { session }
        )
      }
    }
    // if the user is existing, we continue to create the account
    else {
      const updatedData: { name?: string; avatar?: string } = {}
      if (existingUser.name !== name) updatedData.name = name
      if (existingUser.avatar !== avatar) updatedData.avatar = avatar

      // update the user info when necessary
      if (Object.keys(updatedData).length > 0) {
        await User.updateOne({ _id: existingUser._id }, { $set: updatedData }).session(session)
      }
    }

    // commit the transaction
    await session.commitTransaction()

    return NextResponse.json(
      {
        success: true,
        data: { message: 'Sign in successful' },
      },
      { status: 200 }
    )
  } catch (err: unknown) {
    // if any error happened, we should roll back the whole transaction
    await session.abortTransaction()
    return handleError(err, 'api') as APIErrorResponse
  } finally {
    // in the last, we need to end the session
    await session.endSession()
  }
}
