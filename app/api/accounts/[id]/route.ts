import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import Account from '@/database/account.model'
import { handleError } from '@/lib/handlers/error'
import { NotFoundError, ValidationError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { AccountSchema } from '@/lib/validation'

// Get Account by id
export const GET = async (_req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) {
    throw new Error(`Lack of necessary parameter: id`)
  }
  try {
    await dbConnect()
    // query the user with id
    const account = await Account.findById(id)
    if (!account) {
      return new NotFoundError('Account')
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}

// Delete account by id
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
    const account = await Account.findByIdAndDelete(id)
    if (!account) {
      return new NotFoundError('Account')
    }

    return NextResponse.json(
      {
        success: true,
        data: account,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}

// Update account by id
export const PUT = async (req: NextRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  if (!id) {
    throw new Error(`Lack of necessary parameter: id`)
  }
  try {
    await dbConnect()
    const body = await req.json()
    const validatedData = AccountSchema.partial().safeParse(body)

    if (!validatedData.success) {
      throw new ValidationError(z.flattenError(validatedData.error).fieldErrors)
    }

    const updatedAccount = await Account.findByIdAndUpdate(id, validatedData, { new: true })
    if (!updatedAccount) {
      return new NotFoundError('Account')
    }

    return NextResponse.json(
      {
        success: true,
        data: updatedAccount,
      },
      {
        status: 200,
      }
    )
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}
