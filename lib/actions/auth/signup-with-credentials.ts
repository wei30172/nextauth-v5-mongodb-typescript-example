"use server"

import bcrypt from "bcryptjs"
import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { UserProvider } from "@/lib/database/models/types"
import { 
  SignUpFormValues,
  getSignUpFormSchema
 } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail/nodemailer"

export const signUpWithCredentials = async (
  values: SignUpFormValues
) => {
  const t = await getTranslations("SignUpForm.server")
  const tError = await getTranslations("Common.error")
  
  const validatedFields = getSignUpFormSchema().safeParse(values)

  if (!validatedFields.success) {
    return { error: tError("invalidFields") }
  }
  
  const { email, password, name } = validatedFields.data

  await connectDB()
  
  const existingUser = await User.findOne({email})
  if (existingUser) {
    const error = existingUser.provider === UserProvider.CREDENTIALS 
      ? t("error.emailExists")
      : t("error.emailThirdParty")
    return { error }
  }
  
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = new User({ name, email, password: hashedPassword })
  await user.save()

  const verificationToken = await generateToken({email})
  // console.log({verificationToken})

  await sendVerificationEmail(
    email,
    verificationToken
  )
  
  return { success: t("success.confirmationSent") }
}