import { authProviders } from '@/consts/auth'

export interface SignInWithOAuthParams {
  provider: typeof authProviders
  providerAccountId: string
  user: {
    name: string
    avatar: string
    username: string
    email: string
  }
}

export interface AuthCredential {
  name: string
  username: string
  email: string
  password: string
}

export interface CreateQuestionParams {
  title: string
  content: string
  tags: Array<string>
}

export interface EditQuestionParams extends CreateQuestionParams {
  questionId: string
}

export interface GetQuestionParams {
  questionId: string
}

export interface TagQuestionsParams extends Omit<PaginatedQueryParams, 'filter'> {
  tagId: string
}

export interface IncrementViewsParams {
  questionId: string
}

export interface CreateAnswerParams {
  questionId: string
  content: string
}

export interface GetAnswersParams extends PaginatedQueryParams {
  questionId: string
}

export interface CreateVoteParams {
  itemId: string
  itemType: 'question' | 'answer'
  voteType: 'upvote' | 'downvote'
}

export interface UpdateVoteParams extends CreateVoteParams {
  change: 1 | -1
}

export interface AIAnswerParams {
  question: string
  content: string
}

export type HasVotedParams = Pick<CreateVoteParams, 'itemId' | 'itemType'>

export type HasVotedResponse = {
  hasUpvoted: boolean
  hasDownvoted: boolean
}
