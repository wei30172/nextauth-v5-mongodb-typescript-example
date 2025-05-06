"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { UserProvider } from "@/lib/database/models/types"
import {
  ResetPasswordFormValues,
  getResetPasswordFormSchema
} from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/mail"

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

  return { success: t("success.resetSent") }
}