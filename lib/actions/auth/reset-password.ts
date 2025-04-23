"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import {
  ResetPasswordFormValues,
  getResetPasswordFormSchema
} from "@/lib/validations/auth"
import { generateToken } from "@/lib/jwt-token"
// import { generatePasswordResetToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/mailer"
// import { sendPasswordResetEmail } from "@/lib/mail"

export const resetPassword = async (
  values: ResetPasswordFormValues
) => {
  const t = await getTranslations("ResetForm.server")
  const tError = await getTranslations("Common.error")

  const validatedFields = getResetPasswordFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }
  
  const { email } = validatedFields.data
  
  await connectDB()

  const existingUser = await User.findOne({email})

  if (!existingUser) {
    return { error: t("error.emailNotFound") }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: t("error.emailThirdParty") }
  }
  
  const passwordResetToken = await generateToken({email})
  // console.log({passwordResetToken})

  await sendPasswordResetEmail(
    email,
    passwordResetToken
  )

  // const passwordResetToken = await generatePasswordResetToken(email)
  
  // await sendPasswordResetEmail(
  //   passwordResetToken.email,
  //   passwordResetToken.token
  // )

  return { success: t("success.resetSent") }
}