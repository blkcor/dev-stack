import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import User from '@/database/user.model'
import { handleError } from '@/lib/handlers/error'
import { ValidationError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { UserSchema } from '@/lib/validation'

export const GET = async () => {
  try {
    await dbConnect()
    const users = await User.find()
    return NextResponse.json(
      { success: true, data: users },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}

export const POST = async (req: NextRequest) => {
  try {
    await dbConnect()
    const body = await req.json()
    const validatedResult = UserSchema.safeParse(body)
    if (!validatedResult.success) {
      const flattened = z.flattenError(validatedResult.error)
      throw new ValidationError(flattened.fieldErrors)
    }

    const { email, username } = validatedResult.data
    // check if the user is existing
    const exising = await User.findOne({ email })
    if (exising) throw new Error(`User already exists`)

    const existingUsername = await User.findOne({ username })
    if (existingUsername) throw new Error(`Username is already used`)

    const user = await User.create(validatedResult.data)

    return NextResponse.json({ success: true, data: user }, { status: 201 })
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}
