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
