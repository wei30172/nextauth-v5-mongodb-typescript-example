import { NextResponse } from "next/server"

import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/models/types"

// api/user/signIn-with-oauth
export async function POST(
  req: Request
) {
  await connectDB()
  
  try {
    const { account, profile } = await req.json()
    // console.log({ account, profile })
  
    const existingUser = await User.findOne({email: profile.email})
    // console.log({existingUser})

    if (existingUser) {
      await User.findByIdAndUpdate(existingUser._id, {
        emailVerified: new Date(),
        image: profile.picture
      })
      
      const userObject: IUser = {
        ...existingUser.toObject(),
        _id: existingUser._id.toString()
      }
  
      return NextResponse.json(userObject)
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
  
    const userObject: IUser = {
      ...newUser.toObject(),
      _id: newUser._id.toString()
    }
  
    return NextResponse.json(userObject)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}