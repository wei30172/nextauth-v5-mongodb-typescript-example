import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

import connectDB from "@/lib/db"
import { VerificationToken, PasswordResetToken, TwoFactorToken } from "@/lib/models/auth.model"

export const generateVerificationToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour

  await connectDB()

  await VerificationToken.deleteOne({ email })

  const verificationToken = new VerificationToken({
    email,
    token,
    expires
  })

  await verificationToken.save()

  return { ...verificationToken._doc, _id: verificationToken._id.toString() }
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4()
  const expires = new Date(new Date().getTime() + 60 * 60 * 1000) // 1 hour

  await connectDB()

  await PasswordResetToken.deleteOne({ email })

  const passwordResetToken = new PasswordResetToken({
    email,
    token,
    expires
  })

  await passwordResetToken.save()

  return { ...passwordResetToken._doc, _id: passwordResetToken._id.toString() }
}

export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100000, 1000000).toString() // generate a six-digit random number
  // console.log({token})
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000) // 5 mins

  await connectDB()
  
  await TwoFactorToken.deleteOne({ email })

  const twoFactorToken = new TwoFactorToken({
    email,
    token,
    expires
  })

  await twoFactorToken.save()

  return { ...twoFactorToken._doc, _id: twoFactorToken._id.toString() }
}