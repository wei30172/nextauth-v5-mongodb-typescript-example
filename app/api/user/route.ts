import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/types"

// GET /api/user?email=xxx
export async function GET(req: NextRequest) {
  const authError = await authorizeInternalRequest(req)
  if (authError) return authError
  
  await connectDB()
  
  try {
    const email = req.nextUrl.searchParams.get("email")
    if (!email) {
      return NextResponse.json({ error: "Missing email" }, { status: 400 })
    }

    const user = await User.findOne({email})
    if (!user) return NextResponse.json(null)

    return NextResponse.json({
      ...user.toObject(),
      _id: user._id.toString()
    } as IUser)
    
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}