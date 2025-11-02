import { NextRequest, NextResponse } from 'next/server'

import User from '@/database/user.model'
import { handleError } from '@/lib/handlers/error'
import { NotFoundError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { UserSchema } from '@/lib/validation'

// Get user by id
export const GET = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) {
    throw new Error(`Lack of necessary parameter: id`)
  }
  try {
    await dbConnect()
    // query the user with id
    const user = await User.findById(id)
    if (!user) {
      return new NotFoundError('User')
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}

// Delete user by id
export const DELETE = async (
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params
  if (!id) {
    throw new Error(`Lack of necessary parameter: id`)
  }
  try {
    await dbConnect()
    const user = await User.findByIdAndDelete(id)
    if (!user) {
      return new NotFoundError('User')
    }

    return NextResponse.json(
      {
        success: true,
        data: user,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}

// Update user by id
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) {
    throw new Error(`Lack of necessary parameter: id`)
  }
  try {
    await dbConnect()
    const body = await req.json()
    const validatedData = UserSchema.partial().parse(body)

    const updatedUser = await User.findByIdAndUpdate(id, validatedData, { new: true })
    if (!updatedUser) {
      return new NotFoundError('User')
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedUser,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}
