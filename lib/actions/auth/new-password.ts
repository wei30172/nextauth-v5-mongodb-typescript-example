"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db"
import { User, PasswordResetToken } from "@/lib/models/auth.model"
import { NewPasswordValidation } from "@/lib/validations/auth"

type NewPasswordInput = z.infer<typeof NewPasswordValidation>

export const newPassword = async (
  values: NewPasswordInput,
  token?: string | null
) => {
  if (!token) {
    return { error: "Missing token!" }
  }

  const validatedFields = NewPasswordValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }

  const { newPassword } = validatedFields.data
  
  await connectDB()
  
  const existingToken = await PasswordResetToken.findOne({token})

  if (!existingToken) {
    return { error: "Invalid token!" }
  }

  const hasExpired = new Date(existingToken.expires) < new Date()

  if (hasExpired) {
    return { error: "Token has expired!" }
  }

  const existingUser =await User.findOne({email: existingToken.email})

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(newPassword, salt)
  
  await User.findByIdAndUpdate(existingUser._id,
    { password: hashedPassword }
  )

  await PasswordResetToken.findByIdAndDelete(existingToken._id)

  return { success: "Password updated!" }
}