import { NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { TwoFactorConfirmation } from "@/lib/models/auth.model"

// api/twofac/fetch-by-userId
export async function POST(
  req: Request
) {
  await connectDB()
  
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
}