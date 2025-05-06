import { NextResponse } from "next/server"

import connectDB from "@/lib/database/db"
import { TwoFactorConfirmation } from "@/lib/database/models/auth.model"

// api/twofac/delete-by-id
export async function DELETE(
  req: Request
) {
  await connectDB()

  try {
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
  } catch (error) {
    return NextResponse.json(null, { status: 500 })
  }
}