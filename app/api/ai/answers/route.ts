import { deepseek } from '@ai-sdk/deepseek'
import { streamText } from 'ai'
import { NextRequest } from 'next/server'
import z from 'zod'

import { handleError } from '@/lib/handlers/error'
import { ValidationError } from '@/lib/http-errors'
import { AIAnswerSchema } from '@/lib/validation'

export const POST = async (req: NextRequest) => {
  const body = await req.json()
  try {
    const validatedResult = AIAnswerSchema.safeParse(body)
    if (!validatedResult.success) {
      throw new ValidationError(z.flattenError(validatedResult.error).fieldErrors)
    }

    const { question, content, userAnswer } = validatedResult.data

    const result = streamText({
      model: deepseek('deepseek-chat'),
      system:
        "You are a helpful assistant that provides informative responses in markdown format. Use appropriate markdown syntax for headings, lists, code blocks, and emphasis where necessary. For code blocks, use short-form smaller case language identifiers (e.g., 'js' for JavaScript, 'py' for Python, 'ts' for TypeScript, 'html' for HTML, 'css' for CSS, etc.).",
      prompt: `Generate a markdown-formatted response to the following question: "${question}".

Consider the provided context:
**Context:** ${content}

Also, prioritize and incorporate the user's answer when formulating your response:
**User's Answer:** ${userAnswer}

Prioritize the user's answer only if it's correct. If it's incomplete or incorrect,
improve or correct it while keeping the response concise and to the point.
Provide the final answer in markdown format.`,
    })

    return result.toTextStreamResponse()
  } catch (err) {
    return handleError(err, 'api') as APIErrorResponse
  }
}
