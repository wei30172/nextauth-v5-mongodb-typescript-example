import NextAuth from "next-auth"

import { routes } from "@/routes"
import authConfig from "@/auth.config"

const { auth: withAuthMiddleware } = NextAuth(authConfig)

export default withAuthMiddleware((req) => {
  const isLoggedIn = !!req.auth
  const { nextUrl } = req
  // console.log({nextUrl})

  const isApiAuthRoute = nextUrl.pathname.startsWith(routes.apiAuthPrefix)
  const isAuthRoute = routes.auth.includes(nextUrl.pathname)
  const isPublicRoute = routes.public.includes(nextUrl.pathname)
  const defaultUrl = new URL(routes.defaultLoginRedirect, nextUrl)

  if (isApiAuthRoute) {
    return undefined
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(defaultUrl)
    }
    return undefined
  }

  if (!isPublicRoute && !isLoggedIn) {
    let callbackUrl = nextUrl.pathname
    if (nextUrl.search) callbackUrl += nextUrl.search
    
    const encodedCallbackUrl = encodeURIComponent(callbackUrl)
    return Response.redirect(new URL(
      `/signin?callbackUrl=${encodedCallbackUrl}`,
      nextUrl
    ))
  }

  return undefined
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}