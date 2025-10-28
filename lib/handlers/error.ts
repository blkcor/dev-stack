import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

import { RequestError, ValidationError } from '@/lib/http-errors'

export type ResponseType = 'api' | 'server'

const formatResponse = (
  responseType: ResponseType,
  statusCode: number,
  message: string,
  errors?: Record<string, Array<string>>
) => {
  const responseContent = {
    success: false,
    error: {
      message,
      details: errors,
    },
  }

  return responseType === 'api'
    ? NextResponse.json(responseContent, { status: statusCode })
    : {
        status: statusCode,
        ...responseContent,
      }
}

export const handleError = (error: unknown, responseType: ResponseType = 'server') => {
  if (error instanceof RequestError) {
    return formatResponse(responseType, error.statusCode, error.message, error.errors)
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(z.treeifyError(error))
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    )
  }

  if (error instanceof Error) {
    return formatResponse(responseType, 500, error.message)
  }

  return formatResponse(responseType, 500, 'Unexpected error occurred')
}
