"use server"

import connectDB from "@/lib/db"
import { verifyToken, isTokenError } from "@/lib/jwt-token"
import { User } from "@/lib/models/auth.model"
// import { User, VerificationToken } from "@/lib/models/auth.model"

export const newVerification = async (token: string) => {
  const res = await verifyToken(token)
  // console.log({res})

  if (isTokenError(res)) {
    return { error: res.error }
  }
  
  await connectDB()

  const existingUser =await User.findOne({
    $or: [{email: res.email}, {emailPendingVerification: res.email}]
  })

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  // Check if the token corresponds to a pending email update
  if (existingUser.emailPendingVerification === res.email) {
    // This is for updating an existing user's email
    await User.findByIdAndUpdate(existingUser._id, {
      email: res.email, // Update the main email to the new one
      emailVerified: new Date(), // Mark the new email as verified
      emailPendingVerification: null // Clear the pending email field
    })

    return { success: "Email updated and verified!" }
  }

  if (!existingUser.emailVerified) {
    // This is for new user email verification
    await User.findByIdAndUpdate(existingUser._id, {
      emailVerified: new Date(), // Mark email as verified
      email: res.email
    })

    return { success: "Email verified for new registration!" }
  }

  return { error: "Invalid verification request!" }

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
