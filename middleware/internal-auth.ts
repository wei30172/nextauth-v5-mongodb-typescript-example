import { NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"

const INTERNAL_KEY = process.env.INTERNAL_API_KEY!
const BEARER_SECRET = process.env.INTERNAL_API_SECRET!

export const verifyInternalKey = (req: NextRequest): boolean => {
  const key = req.headers.get("x-internal-key")
  return !!key && key === INTERNAL_KEY
}

export const verifyBearerToken = (req: NextRequest): { service: string } | null => {
  const authHeader = req.headers.get("authorization")
  if (!authHeader?.startsWith("Bearer ")) return null

  const token = authHeader.split(" ")[1]
  try {
    return jwt.verify(token, BEARER_SECRET) as { service: string }
  } catch {
    return null
  }
}

export const authorizeInternalRequest = (req: NextRequest): NextResponse | null => {
  const isValidKey = verifyInternalKey(req)
  const payload = verifyBearerToken(req)

  if (isValidKey || payload) return null

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}