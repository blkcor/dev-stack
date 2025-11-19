import { NextResponse } from 'next/server'

export {}

declare global {
  type ActionResponse<T = any> = {
    success: boolean
    data?: T
    error?: {
      message: string
      details: Record<string, Array<string>>
    }
    status?: number
  }

  type SuccessResponse<T> = ActionResponse<T> & { success: true }
  type ErrorResponse = ActionResponse<undefined> & { success: false }

  type APIErrorResponse = NextResponse<ErrorResponse>
  type APIResponse<T> = NextResponse<SuccessResponse<T> | ErrorResponse>

  type RouteParam = {
    params: Promise<Record<string, string>>
    searchParams: Promise<Record<string, string>>
  }

  interface PaginatedQueryParams {
    page?: number
    pageSize?: number
    query?: string
    filter?: string
    sort?: string
  }
}
