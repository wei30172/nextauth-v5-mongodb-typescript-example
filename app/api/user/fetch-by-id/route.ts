import { NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { User } from "@/lib/models/auth.model"
import { IUser } from "@/lib/models/types"

// api/user/fetch-by-id
export async function POST(
  req: Request
) {
  await connectDB()
  
  const { id } = await req.json()

  const user = await User.findById(id)
  
  if (user) {
    const userObject: IUser = {
      ...user.toObject(),
      _id: user._id.toString()
    }
    return NextResponse.json(userObject)
  } else {
    return NextResponse.json(null)
  }
}