import { NextRequest, NextResponse } from "next/server"

import { authorizeInternalRequest } from "@/middleware/internal-auth"
import connectDB from "@/lib/database/db"
import { TwoFactorConfirmation } from "@/lib/database/models/auth.model"

// api/twofac/fetch-by-userId
export async function POST(req: NextRequest) {
  const authError = authorizeInternalRequest(req)
  if (authError) return authError

  await connectDB()
  
  try {
    const { userId } = await req.json()
    
    const confirmation = await TwoFactorConfirmation.findOne({userId})
    // console.log({confirmation})
    
    if (confirmation) {
      const confirmationObject = {
        ... confirmation.toObject(),
        _id: confirmation._id.toString()
      }
      return NextResponse.json(confirmationObject)
    } else {
      return NextResponse.json(null)
    }
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}