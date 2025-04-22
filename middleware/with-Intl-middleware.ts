import { NextFetchEvent, NextRequest, NextResponse } from "next/server"
import createMiddleware from "next-intl/middleware"
import { routing } from "@/i18n/routing"
import type { Middleware } from "./chain"

// Create i18n middleware
const intl = createMiddleware(routing)

export const withIntlMiddleware: Middleware = async (
  req: NextRequest,
  _event?: NextFetchEvent,
  _res?: NextResponse
): Promise<NextResponse> => {
  return intl(req)
}