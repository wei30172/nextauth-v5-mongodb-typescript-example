import { NextResponse } from "next/server"

import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/models/types"

// api/user/fetch-by-id
export async function POST(
  req: Request
) {
  await connectDB()
  
  try {
    const { id } = await req.json()

    const user = await User.findById(id)
    
    if (user) {
      const userObject: IUser = {
        ...user.toObject(),
        _id: user._id.toString()
      }
      return NextResponse.json(userObject)
    }

    return NextResponse.json(null)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}