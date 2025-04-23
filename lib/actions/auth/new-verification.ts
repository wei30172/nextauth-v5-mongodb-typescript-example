"use server"

import { getTranslations } from "next-intl/server"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/jwt-token"
import { User } from "@/lib/models/auth.model"
// import { User, VerificationToken } from "@/lib/models/auth.model"

export const newVerification = async (token: string) => {
  const t = await getTranslations("NewVerificationForm.server")
  const tError = await getTranslations("Common.error")

  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: tError(`${res.error}`) }
  }
  
  await connectDB()

  const existingUser =await User.findOne({
    $or: [{email: res.email}, {emailPendingVerification: res.email}]
  })

  if (!existingUser) {
    return { error: t("error.emailNotFound") }
  }

  // Check if the token corresponds to a pending email update
  if (existingUser.emailPendingVerification === res.email) {
    // This is for updating an existing user's email
    await User.findByIdAndUpdate(existingUser._id, {
      email: res.email, // Update the main email to the new one
      emailVerified: new Date(), // Mark the new email as verified
      emailPendingVerification: null // Clear the pending email field
    })

    return { success: t("success.emailUpdated") }
  }

  if (!existingUser.emailVerified) {
    // This is for new user email verification
    await User.findByIdAndUpdate(existingUser._id, {
      emailVerified: new Date(), // Mark email as verified
      email: res.email
    })

    return { success: t("success.emailVerified") }
  }

  return { error: t("error.invalidRequest") }

  // await connectDB()

  // const existingToken = await VerificationToken.findOne({token})

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

  // await User.findByIdAndUpdate(existingUser._id, {
  //   emailVerified: new Date(),
  //   email: existingToken.email
  // })

  // await VerificationToken.findByIdAndDelete(existingToken._id)

  // return { success: "Email verified!" }
}
