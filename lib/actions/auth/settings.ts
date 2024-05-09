"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import { currentUser } from "@/lib/session"
import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { SettingsValidation } from "@/lib/validations/auth"
import { generateToken } from "@/lib/jwt-token"
// import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mailer"
// import { sendVerificationEmail } from "@/lib/mail"

type SettingsInput = z.infer<typeof SettingsValidation> & {
  [key: string]: any
}

export const settings = async (values: SettingsInput) => {
  const user = await currentUser()
  // console.log({user})

  if (!user) {
    return { error: "Unauthorized" }
  }

  await connectDB()

  const existingUser = await User.findById(user._id)
  // console.log({existingUser})

  if (!existingUser) {
    return { error: "Unauthorized" }
  }

  if (user.provider !== "credentials") {
    values.email = undefined
    values.password = undefined
    values.newPassword = undefined
    values.isTwoFactorEnabled = undefined
  }
  
  if (values.email && values.email !== user.email) {
    const dbUser = await User.findOne({email: values.email})

    if (dbUser && dbUser._id !== user._id) {
      return { error: "Email already in use!" }
    }

    const verificationToken = await generateToken({email:values.email})
    // console.log({verificationToken})
    
    await sendVerificationEmail(
      values.email,
      verificationToken
    )

    // const verificationToken = await generateVerificationToken(values.email)

    // await sendVerificationEmail(
    //   verificationToken.email,
    //   verificationToken.token
    // )

    await User.findByIdAndUpdate(user._id, {
      email: values.email,
      emailVerified: null
    })
    
    return { success: "Verification email sent!" }
  }

  if (values.password && values.newPassword && existingUser.password) {
    const passwordsMatch = await bcrypt.compare(
      values.password,
      existingUser.password
    )

    if (!passwordsMatch) {
      return { error: "Incorrect password!" }
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(values.newPassword, salt)

    values.password = hashedPassword
    values.newPassword = undefined
  }

  for (const key in values) {
    if (values[key] === "") {
      values[key] = undefined
    }
  }

  // console.log({values})

  await User.findByIdAndUpdate(
    user._id,
    { ...values }
  )

  return { success: "Settings Updated!" }
}