"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { ResetPasswordValidation } from "@/lib/validations/auth"
import { generatePasswordResetToken } from "@/lib/token"
import { sendPasswordResetEmail } from "@/lib/mail"

type ResetPasswordInput = z.infer<typeof ResetPasswordValidation>

export const resetPassword = async (values: ResetPasswordInput) => {
  const validatedFields = ResetPasswordValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid email!" }
  }
  
  const { email } = validatedFields.data
  
  await connectDB()

  const existingUser = await User.findOne({email})

  if (!existingUser) {
    return { error: "Email not found!" }
  }
  
  const passwordResetToken = await generatePasswordResetToken(email)
  await sendPasswordResetEmail(
    passwordResetToken.email,
    passwordResetToken.token
  )

  return { success: "Reset email sent!" }
}