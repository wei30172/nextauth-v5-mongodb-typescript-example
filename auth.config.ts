import bcrypt from "bcryptjs"
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import Google from "next-auth/providers/google"

import { UserRole, UserProvider } from "@/lib/database/models/types"
import { getSignInFormSchema } from "@/lib/validations/auth"
import { getUserByEmail, getUserById, signInWithOauth } from "@/lib/api-client/user"
import { fetchConfirmationByUserId, deleteConfirmationById } from "@/lib/api-client/twofac"
import { routes } from "@/routes"
import { AuthErrorCode } from "@/constants/auth-error"

export default {
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  pages: {
    signIn: routes.defaultSignInPage,
    error: routes.defaultErrorPage
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    }),
    Credentials({
      async authorize(credentials) {
        const validatedFields = getSignInFormSchema().safeParse(credentials)

        if (validatedFields.success) {
          const { email, password } = validatedFields.data

          const existingUser = await getUserByEmail(email)
          // console.log({existingUser})

          if (!existingUser || !existingUser.password) return null

          const passwordsMatch = await bcrypt.compare(
            password,
            existingUser.password
          )

          existingUser.password = ""

          // console.log({user})
          if (passwordsMatch) return existingUser
        }
        
        return null
      }
    })
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // console.log({user})
      // console.log({account, profile})
      const isOauth = account?.provider && account.provider !== UserProvider.CREDENTIALS
      const email = profile?.email

      if (isOauth && email) {
        const existingUser = await getUserByEmail(email)

        if (existingUser && existingUser.provider !== account.provider) {
          return `${routes.defaultErrorPage}?error=${AuthErrorCode.PROVIDER_MISMATCH}`
        }

        // TODO: Test profile.email_verified behavior across providers (e.g., Google vs GitHub)
        if (account.provider === UserProvider.GOOGLE && !profile.email_verified) {
          return `${routes.defaultErrorPage}?error=${AuthErrorCode.EMAIL_UNVERIFIED}`
        }

        return await signInWithOauth({account, profile})
      }

      if (account?.provider === UserProvider.CREDENTIALS && user._id) {
        const existingUser = await getUserById(user._id)
        // console.log({existingUser})

        if (!existingUser?.emailVerified) return false

        if (existingUser?.isTwoFactorEnabled) {
          const twoFactorConfirmation = await fetchConfirmationByUserId(
            existingUser._id
          )
          if (!twoFactorConfirmation) return false

          await deleteConfirmationById(twoFactorConfirmation._id)
        }
      }

      return true
    },
    async jwt({ token }) {
      // console.log({token})
      if (!token.email) return token

      const existingUser = await getUserByEmail(token.email)

      if (!existingUser) return token

      // console.log({existingUser})
      token._id = existingUser._id
      token.name = existingUser.name
      token.email = existingUser.email
      token.role = existingUser.role
      token.provider = existingUser.provider
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled
      
      return token
    },
    async session({ session, token }) {
      // console.log({session, token})
      if (token._id && session.user) {
        session.user._id = token._id as string
        session.user.name = token.name as string
        session.user.email = token.email as string
        session.user.role = token.role as UserRole
        session.user.provider = token.provider as string
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean
      }

      return session
    }
  }
} satisfies NextAuthConfig