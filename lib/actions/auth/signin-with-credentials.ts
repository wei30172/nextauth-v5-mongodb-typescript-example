"use server"

import { AuthError } from "next-auth"
import { getTranslations } from "next-intl/server"

import { signIn } from "@/auth"
import { routes } from "@/routes"
import connectDB from "@/lib/database/db"
import { User, TwoFactorToken, TwoFactorConfirmation } from "@/lib/database/models/auth.model"
import {
  SignInFormValues,
  getSignInFormSchema
} from "@/lib/validations/auth"
import { generateToken, generateCode } from "@/lib/token"
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"

export const signInWithCredentials = async (
  values: SignInFormValues,
  callbackUrl?: string | null
) => {
  // console.log({callbackUrl})
  const t = await getTranslations("SignInForm.server")
  const tError = await getTranslations("Common.error")
  
  const validatedFields = getSignInFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }
  
  const { email, password, code } = validatedFields.data

  await connectDB()

  const existingUser = await User.findOne({email})
  // console.log({existingUser})
  
  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: t("error.emailNotFound") }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateToken({email: existingUser.email})
    // console.log({verificationToken})

    await sendVerificationEmail(
      existingUser.email,
      verificationToken
    )

    return { success: t("success.confirmationSent") }
  }

  if (existingUser.isTwoFactorEnabled && existingUser.email) {
    if (code) {
      const twoFactorToken = await TwoFactorToken.findOne({
        email: existingUser.email
      })

      if (!twoFactorToken || twoFactorToken.token !== code) {
        return { error: t("error.invalidCode") }
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date()

      await TwoFactorToken.findByIdAndDelete(twoFactorToken._id)

      if (hasExpired) {
        return { error: t("error.codeExpired") }
      }

      const existingConfirmation = await TwoFactorConfirmation.findOne({userId: existingUser._id})

      if (existingConfirmation) {
        await TwoFactorConfirmation.findByIdAndDelete(existingConfirmation._id)
      }

      const twoFactorConfirmation = new TwoFactorConfirmation({
        userId: existingUser._id
      })
      await twoFactorConfirmation.save()
    } else {
      const twoFactorToken = await generateCode(existingUser.email)
      // console.log({twoFactorToken})

      await sendTwoFactorTokenEmail(
        existingUser.email,
        twoFactorToken
      )

      return { twoFactor: true }
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect:false
    })
    return { url: callbackUrl || routes.defaultLoginRedirect }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: t("error.invalidCredentials") }
        default:
          return { error: tError("actionFailed") }
      }
    }

    throw error
  }
}