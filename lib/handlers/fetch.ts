// RequestInit represents the set of options that can be used to configure a fetch request
// reference to: https://developer.mozilla.org/en-US/docs/Web/API/RequestInit

import { handleError } from '@/lib/handlers/error'
import { RequestError } from '@/lib/http-errors'
import { logger } from '@/lib/logger'

interface FetchOptions extends RequestInit {
  timeout?: number
}

// If the function return "true", the Typescript compiler will narrow the err type to "Error"
const isError = (err: unknown): err is Error => {
  return err instanceof Error
}

export const fetchHandler = async <T>(
  url: string,
  options: FetchOptions = {}
): Promise<ActionResponse<T>> => {
  const { timeout = 100000, headers: customHeaders = {}, ...restOptions } = options
  // abortController for control the request action
  const abortController = new AbortController()
  // when the timeout, we need to cancel the request progress
  const id = setTimeout(() => abortController.abort(), timeout)

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  // construct the full request headers
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders }
  // construct the full request config
  const config: RequestInit = {
    ...restOptions,
    headers,
    signal: abortController.signal,
  }
  // go to make a fetch
  try {
    const response = await fetch(url, config)
    let errorMessage = `HTTP error: ${response.statusText}`
    if (!response.ok) {
      const errorData = (await response.json()) as ErrorResponse

      if (errorData && errorData.error && errorData.error.message) {
        errorMessage = errorData.error.message
      }
      throw new RequestError(response.status, errorMessage)
    }

    return (await response.json()) as ActionResponse<T>
  } catch (err) {
    const error = isError(err) ? err : new Error('Unknown Error')
    // if the error is AbortError
    if (error.name === 'AbortError') {
      logger.error(`Request to ${url} timed out`)
    } else {
      logger.error(`Error fetching ${url}: ${error.message}`)
    }

    return handleError(error) as ErrorResponse
  } finally {
    // whatever success or fail to request, clear the timeout in the end
    clearTimeout(id)
  }
}

/**
 * Fetch handler for streaming responses
 * Use this when you need to process server-sent events or streaming data
 *
 * @param url - The URL to fetch from
 * @param options - Fetch options (without timeout, as streams can be long-running)
 * @param onChunk - Callback function that receives accumulated text as chunks arrive
 * @returns Promise that resolves with the complete accumulated text
 *
 * @example
 * ```typescript
 * const result = await fetchHandlerStream(
 *   '/api/stream',
 *   { method: 'POST', body: JSON.stringify({ prompt: 'Hello' }) },
 *   (accumulatedText) => {
 *     console.log('Received:', accumulatedText)
 *   }
 * )
 * ```
 */
export const fetchHandlerStream = async (
  url: string,
  options: FetchOptions = {},
  onChunk?: (accumulatedText: string) => void
): Promise<string> => {
  const { headers: customHeaders = {}, ...restOptions } = options

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  }

  // construct the full request headers
  const headers: HeadersInit = { ...defaultHeaders, ...customHeaders }
  // construct the full request config
  const config: RequestInit = {
    ...restOptions,
    headers,
  }

  try {
    const response = await fetch(url, config)

    if (!response.ok) {
      let errorMessage = `HTTP error: ${response.statusText}`
      try {
        const errorData = (await response.json()) as ErrorResponse
        if (errorData && errorData.error && errorData.error.message) {
          errorMessage = errorData.error.message
        }
      } catch {
        // If parsing error response fails, use the default error message
      }
      throw new RequestError(response.status, errorMessage)
    }

    const reader = response.body?.getReader()
    const decoder = new TextDecoder()

    if (!reader) {
      throw new Error('No response body available for streaming')
    }

    let accumulatedText = ''

    while (true) {
      const { done, value } = await reader.read()

      if (done) break

      const textChunk = decoder.decode(value, { stream: true })
      accumulatedText += textChunk

      if (onChunk) {
        onChunk(accumulatedText)
      }
    }

    return accumulatedText
  } catch (err) {
    const error = isError(err) ? err : new Error('Unknown Error')
    logger.error(`Error streaming from ${url}: ${error.message}`)
    throw error
  }
}
