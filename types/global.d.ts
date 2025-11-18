import { NextResponse } from 'next/server'

export {}

declare global {
  interface Tag {
    _id: string
    name: string
  }

  interface Author {
    _id: string
    name: string
    avatar: string
  }

  interface Question {
    _id: string
    title: string
    content: string
    tags: Tag[]
    author: Author
    upvotes: number
    answers: number
    views: number
    createdAt: string
  }

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
