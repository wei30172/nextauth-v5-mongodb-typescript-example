import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { User } from "@/lib/database/models/auth.model"
import { IUser } from "@/lib/database/models/types"

// GET /api/user/:id
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const authError = await authorizeInternalRequest(req)
  if (authError) return authError

  await connectDB()
  
  try {
    const user = await User.findById(params.id)
    if (!user) return NextResponse.json(null)
    
    return NextResponse.json({
      ...user.toObject(),
      _id: user._id.toString()
    } as IUser)

  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}