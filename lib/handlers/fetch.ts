// RequestInit represents the set of options that can be used to configure a fetch request
// reference to: https://developer.mozilla.org/en-US/docs/Web/API/RequestInit
import { clearTimeout } from 'node:timers'

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
  const { timeout = 5000, headers: customHeaders = {}, ...restOptions } = options
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
    if (!response.ok) {
      throw new RequestError(response.status, `HTTP error: ${response.statusText}`)
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
