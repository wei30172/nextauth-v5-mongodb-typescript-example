import { NextResponse, type NextRequest, type NextFetchEvent } from "next/server"

export type Middleware = (
  req: NextRequest & { auth?: unknown },
  event?: NextFetchEvent,
  res?: NextResponse
) => Promise<NextResponse> | NextResponse

export function chain(...middlewares: Middleware[]): Middleware {
  return async (req, event, res = NextResponse.next()) => {
    let response = res

    for (const middleware of middlewares) {
      response = await middleware(req, event, response)

      // Early exit if a redirect or rewrite has occurred
      if (response.headers.get("X-Middleware-Next") === null) {
        return response
      }
    }

    return response
  }
}