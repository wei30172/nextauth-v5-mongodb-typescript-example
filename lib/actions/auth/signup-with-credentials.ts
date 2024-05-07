"use server"

import { z } from "zod"
import bcrypt from "bcryptjs"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { SignUpValidation } from "@/lib/validations/auth"
import { generateVerificationToken } from "@/lib/token"
import { sendVerificationEmail } from "@/lib/mail"

type SignUpWithCredentialsInput = z.infer<typeof SignUpValidation>

export const signUpWithCredentials = async (values: SignUpWithCredentialsInput) => {
  const validatedFields = SignUpValidation.safeParse(values)

  if (!validatedFields.success) {
    return { error: "Invalid fields!" }
  }
  
  const { email, password, name } = validatedFields.data

  await connectDB()

  const existingUser = await User.findOne({email})
  if (existingUser) return { error: "Email already exists" }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)

  const user = new User({ name, email, password: hashedPassword })
  await user.save()

  const verificationToken = await generateVerificationToken(email)
  
  await sendVerificationEmail(
    verificationToken.email,
    verificationToken.token
  )
  
  return { success: "Confirmation email sent!" }
}