"use server"

import bcrypt from "bcryptjs"
import { getTranslations } from "next-intl/server"

import { currentUser } from "@/lib/session"
import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { UserProvider } from "@/lib/database/models/types"
import { SettingsFormValues } from "@/lib/validations/auth"
import { generateToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"
import { cleanEmptyStrings } from "@/lib/utils"

export const settings = async (
  values: SettingsFormValues
) => {
  const t = await getTranslations("SettingsForm.server")
  const tError = await getTranslations("Common.error")

  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: tError("unauthorized") }
  }

  await connectDB()

  const existingUser = await User.findById(user._id)
  // console.log({existingUser})

  if (!existingUser) {
    return { error: tError("unauthorized") }
  }

  if (user.provider !== UserProvider.CREDENTIALS) {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }
  
  if (values.email && values.email !== user.email) {
    const dbUser = await User.findOne({email: values.email})

    if (dbUser && dbUser._id !== user._id) {
      return { error: t("error.emailInUse") }
    }

    const verificationToken = await generateToken({email:values.email})
    // console.log({verificationToken})
    
    await sendVerificationEmail(
      values.email,
      verificationToken
    )

    await User.findByIdAndUpdate(user._id, {
      emailPendingVerification: values.email,
      emailVerified: null
    })
    
    return { success: t("success.verificationSent") }
  }

  if (values.password && values.newPassword && existingUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    )

    if (!passwordsMatch) {
      return { error: t("error.incorrectPassword") }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(values.newPassword, salt)

    values.password = hashedPassword
    values.newPassword = undefined
  }

  const cleanedValues = cleanEmptyStrings(values)

  await User.findByIdAndUpdate(user._id, cleanedValues)

  return { success: t("success.settingsUpdated") }
}