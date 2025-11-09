'use server'

import { type Session } from 'next-auth'
import { z } from 'zod'

import { auth } from '@/auth'
import { ValidationError, UnauthorizedError } from '@/lib/http-errors'
import dbConnect from '@/lib/mongoose'

interface ActionOptions<T> {
  params?: T
  schema?: z.ZodSchema<T>
  authorize?: boolean
}

const action = async <T>({ params, schema, authorize = false }: ActionOptions<T>) => {
  // 1. check the schema and params is provided and validated
  if (schema && params) {
    try {
      schema.parse(params)
    } catch (err) {
      if (err instanceof z.ZodError) {
        return new ValidationError(z.flattenError(err).fieldErrors)
      }
      return new Error('Schema validation error')
    }
  }

  // 2. check if the user is authorized
  let session: Session | null = null
  if (authorize) {
    session = await auth()
    if (!session) {
      return new UnauthorizedError()
    }
  }

  // 3. connect to the database
  await dbConnect()

  // 4. return the params and session
  return { params, session }
}

export default action
