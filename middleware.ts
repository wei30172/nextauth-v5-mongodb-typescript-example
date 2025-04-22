import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server"
import NextAuth from "next-auth"
import authConfig from "@/auth.config"
import { chain } from "@/middleware/chain"
import { withAuthMiddleware } from "@/middleware/with-auth-middleware"
import { withIntlMiddleware } from "@/middleware/with-Intl-middleware"

// Create a chain function
const baseMiddleware = chain(withAuthMiddleware, withIntlMiddleware)

// Use NextAuth to generate auth middleware wrapper
const { auth: withAuthWrapper } = NextAuth(authConfig)


const middleware = withAuthWrapper(async (req: NextRequest) => {
  const res = NextResponse.next()
  const event = {} as NextFetchEvent
  return await baseMiddleware(req, event, res)
})

export default middleware

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|favicon.ico).*)"]
}