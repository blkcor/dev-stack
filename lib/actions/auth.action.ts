'use server'

import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

import { signIn } from '@/auth'
import Account from '@/database/account.model'
import User from '@/database/user.model'
import { AuthCredential } from '@/types/action'

import action from '../handlers/action'
import { handleError } from '../handlers/error'
import { NotFoundError } from '../http-errors'
import { SignUpSchema, SignInSchema } from '../validation'

export const signUpWithCredentials = async (params: AuthCredential): Promise<ActionResponse> => {
  const validatedResult = await action({
    params,
    schema: SignUpSchema,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { username, name, password, email } = validatedResult.params!

  const session = await mongoose.startSession()
  session.startTransaction()

  try {
    const existingUser = await User.findOne({ email }).session(session)
    if (existingUser) {
      throw new Error(`User already exists`)
    }

    const existingUsername = await User.findOne({ username }).session(session)
    if (existingUsername) {
      throw new Error(`Username is already used`)
    }

    const hashedPassword = await bcrypt.hash(password, 12)
    // create the user
    const [newUser] = await User.create(
      [
        {
          username,
          name,
          email,
        },
      ],
      { session }
    )
    // create the according account
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: 'credentials',
          providerAccountId: email,
          password: hashedPassword,
        },
      ],
      { session }
    )

    await session.commitTransaction()
    // after finishing the sign up, we sign in it
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    await session.abortTransaction()
    return handleError(error, 'server') as ErrorResponse
  } finally {
    await session.endSession()
  }
}

export const signInWithCredentials = async (
  params: Pick<AuthCredential, 'email' | 'password'>
): Promise<ActionResponse> => {
  const validatedResult = await action({
    params,
    schema: SignInSchema,
  })

  if (validatedResult instanceof Error) {
    return handleError(validatedResult, 'server') as ErrorResponse
  }

  const { password, email } = validatedResult.params!

  try {
    const existingUser = await User.findOne({ email })
    if (!existingUser) {
      throw new NotFoundError('User')
    }

    const existingAccount = await Account.findOne({
      provider: 'credentials',
      providerAccountId: email,
    })

    if (!existingAccount) {
      throw new NotFoundError('Account')
    }

    // compare the password
    const isValid = await bcrypt.compare(password, existingAccount.password!)
    if (!isValid) {
      throw new Error('Invalid password')
    }

    // after finishing the sign up, we sign in it
    await signIn('credentials', {
      email,
      password,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    return handleError(error, 'server') as ErrorResponse
  }
}
