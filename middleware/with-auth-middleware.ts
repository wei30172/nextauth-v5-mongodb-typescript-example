import { NextResponse } from "next/server"

import { routes } from "@/routes"
import { routing } from "@/i18n/routing"
import type { Middleware } from "./chain"

// Remove locale prefix from pathname
const normalizePathname = (pathname: string): string => {
  const localePattern = routing.locales.join("|")
  const regex = new RegExp(`^\\/(${localePattern})(?=\\/|$)`)
  const normalized = pathname.replace(regex, "")
  return normalized === "" ? "/" : normalized
}

export const withAuthMiddleware: Middleware = async (req, _event, _res) => {
  const res = _res ?? NextResponse.next()

  const { nextUrl, auth } = req
  const isLoggedIn = !!auth
  // console.log({isLoggedIn})
  const pathname = normalizePathname(nextUrl.pathname)
  // console.log({pathname})
  
  const isPublic = routes.public.includes(pathname)
  const isAuthRoute = routes.auth.includes(pathname)
  const defaultRedirect = new URL(routes.defaultLoginRedirect, nextUrl)

  // Already logged in → redirect away from /signin, /signup
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(defaultRedirect)
  }

  // Not logged in → redirect protected routes to /signin
  if (!isPublic && !isLoggedIn && !isAuthRoute) {
    const callbackUrl = pathname + (nextUrl.search || "")
    const encoded = encodeURIComponent(callbackUrl)
    return NextResponse.redirect(new URL(`/signin?callbackUrl=${encoded}`, nextUrl))
  }

  return res
}