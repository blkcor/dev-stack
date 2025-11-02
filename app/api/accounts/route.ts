import { NextRequest, NextResponse } from 'next/server'

import Account from '@/database/account.model'
import { handleError } from '@/lib/handlers/error'
import { ForbiddenError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'
import { AccountSchema } from '@/lib/validation'

export const GET = async () => {
  try {
    await dbConnect()
    const accounts = await Account.find()
    return NextResponse.json(
      { success: true, data: accounts },
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
    const validatedResult = AccountSchema.parse(body)

    const existingAccount = await Account.findOne({
      provider: validatedResult.provider,
      providerAccountId: validatedResult.providerAccountId,
    })

    if (existingAccount) throw new ForbiddenError('Account with the same provider already exists')

    // create a new account
    const account = await Account.create(validatedResult)

    return NextResponse.json({ success: true, data: account }, { status: 201 })
  } catch (error) {
    return handleError(error, 'api') as APIErrorResponse
  }
}
