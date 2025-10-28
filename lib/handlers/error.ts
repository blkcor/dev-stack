import { NextResponse } from 'next/server'
import { z, ZodError } from 'zod'

import { RequestError, ValidationError } from '@/lib/http-errors'
import { logger } from '@/lib/logger'

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
    logger.error({ err: error }, `${responseType.toUpperCase()} Error: ${error.message}`)
    return formatResponse(responseType, error.statusCode, error.message, error.errors)
  }

  if (error instanceof ZodError) {
    const validationError = new ValidationError(z.treeifyError(error))

    logger.error({ err: error }, `Validation Error: ${error.message}`)
    return formatResponse(
      responseType,
      validationError.statusCode,
      validationError.message,
      validationError.errors
    )
  }

  if (error instanceof Error) {
    logger.error(error.message)
    return formatResponse(responseType, 500, error.message)
  }

  logger.error('Unexpected error occurred')
  return formatResponse(responseType, 500, 'Unexpected error occurred')
}
