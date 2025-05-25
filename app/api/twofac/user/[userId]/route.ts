import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { TwoFactorConfirmation } from "@/lib/database/models/auth.model"
import { ITwoFactorConfirmation } from "@/lib/database/models/types"

// GET /api/twofac/user/:userId
export async function GET(_: NextRequest, { params }: { params: { userId: string } }) {
  const authError = await authorizeInternalRequest(_)
  if (authError) return authError
  
  await connectDB()
  
  try {
    const confirmation = await TwoFactorConfirmation.findOne({ userId: params.userId })
    if (!confirmation) return NextResponse.json(null)
    // console.log({confirmation})
    
    return NextResponse.json({
      ...confirmation.toObject(),
      _id: confirmation._id.toString()
    } as ITwoFactorConfirmation)
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}