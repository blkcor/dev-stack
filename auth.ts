import NextAuth from 'next-auth'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { authProviders } from '@/consts/auth'
import { api } from '@/lib/api'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  // 1. we will check if the sign-in account type is "credentials", if yes, we will handle it
  // the other way around when doing email-password based authentication
  // 2. but if the account type is not credentials, we will call this new 'signin-with-oauth' app and create OAuth account
  callbacks: {
    session: async ({ session, token }) => {
      session.user.id = token.sub as string
      return session
    },
    jwt: async ({ token, account }) => {
      if (account) {
        // if the user signin with email and password
        // the providerAccountId is the email
        // otherwise, the providerAccountId is the providerAccountId
        console.log('Account: ', account)
        const { data: existingAccount, success } = await api.accounts.getByProvider(
          account.type === 'credentials' ? token.email! : account.providerAccountId
        )
        if (!success || !existingAccount) return token

        const userId = existingAccount.userId
        if (userId) {
          token.sub = userId.toString()
        }
      }
      return token
    },
    signIn: async ({ user, profile, account }) => {
      if (account?.type === 'credentials') return true
      if (!account || !user) return false

      const userInfo = {
        name: user.name!,
        email: user.email!,
        avatar: user.image!,
        username:
          account.provider === 'github'
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      }

      const { success } = await api.auth.signInWithOAuth({
        provider: account.provider as unknown as typeof authProviders,
        providerAccountId: account.providerAccountId,
        user: userInfo,
      })

      return success
    },
  },
})
