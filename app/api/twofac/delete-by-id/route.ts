import { NextResponse } from "next/server"

import connectDB from "@/lib/db"
import { TwoFactorConfirmation } from "@/lib/models/auth.model"

// api/twofac/delete-by-id
export async function DELETE(
  req: Request
) {
  await connectDB()

  const { id } = await req.json()

  const confirmation = await TwoFactorConfirmation.findByIdAndDelete(id)
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