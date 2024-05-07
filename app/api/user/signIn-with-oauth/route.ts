import { NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"

// api/user/signIn-with-oauth
export async function POST(
  req: Request
) {
  await connectDB()
  
  const { account, profile } = await req.json()
  // console.log({ account, profile })

  
  const existingUser = await User.findOne({email: profile.email})
  // console.log({existingUser})

  if (existingUser) {
    await User.findByIdAndUpdate(existingUser._id, {
      emailVerified: new Date(),
      image: profile.picture
    })
    
    return NextResponse.json(existingUser)
  }
  
  const newUser = new User({
    name: profile.name,
    email: profile.email,
    image: profile.picture,
    provider: account.provider,
    emailVerified: new Date()
  })
  
  await newUser.save()
  // console.log({newUser})

  if (newUser) {
    return NextResponse.json(newUser)
  } else {
    return NextResponse.json(null)
  }
}