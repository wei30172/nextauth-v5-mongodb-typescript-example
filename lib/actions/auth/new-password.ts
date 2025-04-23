"use server"

import bcrypt from "bcryptjs"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/jwt-token"
import { User } from "@/lib/models/auth.model"
// import { User, PasswordResetToken } from "@/lib/models/auth.model"
import { UserProvider } from "@/lib/models/types"
import {
  NewPasswordFormValues,
  getNewPasswordFormSchema
} from "@/lib/validations/auth"

export const newPassword = async (
  values: NewPasswordFormValues,
  token?: string | null
) => {
  const t = await getTranslations("NewPasswordForm.server")
  const tError = await getTranslations("Common.error")

  const validatedFields = getNewPasswordFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }

  if (!token) {
    return { error: tError("missingToken") }
  }

  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: tError(`${res.error}`) }
  }

  await connectDB()
  
  const existingUser = await User.findOne({email: res.email})

  if (!existingUser) {
    return { error: t("error.emailNotFound") }
  }

  if (existingUser.provider !== UserProvider.CREDENTIALS) {
    return { error: t("error.emailThirdParty") }
  }
  
  const { newPassword } = validatedFields.data

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)

  await User.findByIdAndUpdate(existingUser._id,
    { password: hashedPassword }
  )

  return { success: t("success.passwordUpdated") }

  // await connectDB()
  
  // const existingToken = await PasswordResetToken.findOne({token})

  // if (!existingToken) {
  //   return { error: "Invalid token!" }
  // }

  // const hasExpired = new Date(existingToken.expires) < new Date()

  // if (hasExpired) {
  //   return { error: "Token has expired!" }
  // }

  // const existingUser =await User.findOne({email: existingToken.email})

  // if (!existingUser) {
  //   return { error: "Email does not exist!" }
  // }

  // const salt = await bcrypt.genSalt(10)
  // const hashedPassword = await bcrypt.hash(newPassword, salt)
  
  // await User.findByIdAndUpdate(existingUser._id,
  //   { password: hashedPassword }
  // )

  // await PasswordResetToken.findByIdAndDelete(existingToken._id)

  // return { success: "Password updated!" }
}