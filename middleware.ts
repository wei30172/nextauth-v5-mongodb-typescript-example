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

  if (isApiAuthRoute) {
    return undefined
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      const defaultUrl = new URL(routes.defaultLoginRedirect, nextUrl)
      return Response.redirect(defaultUrl)
    }
    return undefined
  }

  if (!isPublicRoute && !isLoggedIn) {
    const signInUrl = new URL('signin', nextUrl)
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return Response.redirect(signInUrl)
  }

  return undefined
})

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}