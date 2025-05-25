import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/models/types"

// PUT /api/user/oauth
export async function PUT(req: NextRequest) {
  const authError = await authorizeInternalRequest(req)
  if (authError) return authError

  await connectDB()
  
  try {
    const { account, profile } = await req.json()
    // console.log({ account, profile })
  
    const existingUser = await User.findOne({ email: profile.email })
    // console.log({existingUser})

    if (existingUser) {
      await User.findByIdAndUpdate(existingUser._id, {
        emailVerified: new Date(),
        image: profile.picture
      })
      
      return NextResponse.json({
        ...existingUser.toObject(),
        _id: existingUser._id.toString()
      } as IUser)
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
  
    return NextResponse.json({
      ...newUser.toObject(),
      _id: newUser._id.toString()
    } as IUser)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}