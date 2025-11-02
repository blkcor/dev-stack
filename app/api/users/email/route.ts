import { NextRequest } from 'next/server'
import { z } from 'zod'

import { handleError } from '@/lib/handlers/error'
import { ValidationError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { UserSchema } from '@/lib/validation'

export const POST = async (req: NextRequest) => {
  const { email } = await req.json()

  try {
    await dbConnect()
    const parsedResult = UserSchema.partial().safeParse({ email })
    if (!parsedResult.success) {
      return new ValidationError(
        z.flattenError(parsedResult.error).fieldErrors as Record<string, Array<string>>
      )
    }
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}
