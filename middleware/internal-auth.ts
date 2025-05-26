import { JWTPayload, jwtVerify } from "jose"
import { NextRequest, NextResponse } from "next/server"

const INTERNAL_KEY = process.env.INTERNAL_API_KEY!
const BEARER_SECRET = new TextEncoder().encode(process.env.INTERNAL_API_SECRET!)

interface VerifiedBearerPayload {
  service: string
}

export const verifyInternalKey = (req: NextRequest): boolean => {
  const key = req.headers.get("x-internal-key")
  return !!key && key === INTERNAL_KEY
}

export const verifyBearerToken = async (req: NextRequest): Promise<VerifiedBearerPayload | null> => {
  const authHeader = req.headers.get("authorization")?.trim()
  if (!authHeader) return null

  const [scheme, token] = authHeader.split(" ")
  if (scheme !== "Bearer" || !token) return null
  
  try {
    const { payload } = await jwtVerify(token, BEARER_SECRET)

    if (typeof (payload as JWTPayload).service === "string") {
      return payload as unknown as VerifiedBearerPayload
    }

    return null
  } catch (err) {
    console.error("[JWT_VERIFY_FAIL]", (err as Error).message)
    return null
  }
}

export const authorizeInternalRequest = async (
  req: NextRequest,
  allowedServices?: string[]
): Promise<NextResponse | null> => {
  const isValidKey = verifyInternalKey(req)
  const payload = await verifyBearerToken(req)

  if (isValidKey) return null

  if (payload) {
    if (allowedServices && !allowedServices.includes(payload.service)) {
      console.warn(`[SERVICE_NOT_ALLOWED] service=${payload.service}`)
      return NextResponse.json({ error: "Service not allowed" }, { status: 403 })
    }
    return null
  }

  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}