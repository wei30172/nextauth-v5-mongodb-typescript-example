import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/models/types"

// api/user/fetch-by-email
export async function POST(req: NextRequest) {
  const authError = authorizeInternalRequest(req)
  if (authError) return authError
  
  await connectDB()
  
  try {
    const { email } = await req.json()
  
    const user = await User.findOne({email})

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