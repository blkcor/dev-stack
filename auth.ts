import bcrypt from 'bcryptjs'
import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import GitHub from 'next-auth/providers/github'
import Google from 'next-auth/providers/google'

import { authProviders } from '@/consts/auth'
import { IUserDoc } from '@/database/user.model'
import { api } from '@/lib/api'
import { SignInSchema } from '@/lib/validation'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials)
        if (!validatedFields.success) {
          return null
        }

        const { email, password } = validatedFields.data
        // get account info
        const { data: existingAccount } = await api.accounts.getByProvider(email)
        if (!existingAccount) {
          return null
        }

        // get the user info
        const { data: existingUser } = (await api.users.getById(
          existingAccount.userId.toString()
        )) as ActionResponse<IUserDoc>
        if (!existingUser) {
          return null
        }

        // if the password is correct
        const isPasswordValid = await bcrypt.compare(password, existingAccount.password!)
        if (!isPasswordValid) {
          return null
        }

        // the returned value will be saved to the session
        return {
          id: existingUser._id.toString(),
          name: existingUser.name,
          email: existingUser.email,
          image: existingUser.avatar,
        }
      },
    }),
  ],
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
      // 1. we will check if the sign-in account type is "credentials", if yes, we will handle it
      // the other way around when doing email-password based authentication
      // 2. but if the account type is not credentials, we will call this new 'signin-with-oauth' app and create OAuth account
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
