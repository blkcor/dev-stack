import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import Account from '@/database/account.model'
import { handleError } from '@/lib/handlers/error'
import { NotFoundError, ValidationError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { AccountSchema, UserSchema } from '@/lib/validation'

export const POST = async (req: NextRequest) => {
  const { providerAccountId } = await req.json()

  try {
    await dbConnect()
    const parsedResult = AccountSchema.partial().safeParse({ providerAccountId })
    if (!parsedResult.success) {
      return new ValidationError(z.flattenError(parsedResult.error).fieldErrors)
    }

    const account = await Account.findOne({ providerAccountId })
    if (!account) throw new NotFoundError('Account')

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
