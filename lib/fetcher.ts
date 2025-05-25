import { SignJWT } from "jose"

interface FetcherOptions extends RequestInit {
  baseUrl?: string
}

export interface ApiError {
  error: string
  status: number
}

export const fetcher = async <T>(
  endpoint: string,
  options: FetcherOptions = {}
): Promise<T> => {
  const { baseUrl = "", headers: customHeaders, ...restOptions } = options

  const headers = {
    "Content-Type": "application/json",
    ...customHeaders
  }

  try {
    const response = await fetch(`${baseUrl}/${endpoint}`, {
      ...restOptions,
      headers
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || "An error occurred during the request.")
    }

    return await response.json() as T

  } catch (error) {
    // console.error("Error in fetcher:", error)
    throw new Error((error as Error).message || "Failed to fetch data.")
  }
}

export type AuthStrategy = "internal-key" | "bearer"

interface InternalApiFetcherProps {
  endpoint: string
  options?: RequestInit
  authStrategy?: AuthStrategy // default: "internal-key"
  serviceName?: string // for bearer token payload
}

// Generates headers for internal API auth based on strategy
const generateInternalAuthHeaders = async (
  strategy: AuthStrategy,
  serviceName: string
): Promise<Record<string, string>> => {
  if (strategy === "internal-key") {
    return {
      "x-internal-key": process.env.INTERNAL_API_KEY!
    }
  }

  const secret = new TextEncoder().encode(process.env.NEXT_PUBLIC_INTERNAL_API_SECRET!)

  const token = await new SignJWT({ service: serviceName })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("10m")
    .sign(secret)

  return {
    Authorization: `Bearer ${token}`
  }
}

// For APIs that return JSON (default)
export const internalApiFetcher = async <T>({
  endpoint,
  options,
  authStrategy = "internal-key",
  serviceName = "internal-service"
}: InternalApiFetcherProps) => {
  const authHeaders = await generateInternalAuthHeaders(authStrategy, serviceName)

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
    ...authHeaders
  }

  return fetcher<T>(endpoint, {
    ...options,
    headers,
    baseUrl: process.env.NEXT_PUBLIC_APP_URL
  })
}

// For APIs that return stream/blob/raw Response
export const rawInternalApiFetcher = async ({
  endpoint,
  options,
  authStrategy = "internal-key",
  serviceName = "internal-service"
}: InternalApiFetcherProps): Promise<Response> => {
  const authHeaders = await generateInternalAuthHeaders(authStrategy, serviceName)

  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>),
    ...authHeaders
  }

  return fetch(`${process.env.NEXT_PUBLIC_APP_URL}/${endpoint}`, {
    ...options,
    headers
  })
}

// External API
interface ExternalApiFetcherProps {
  apiUrl: string
  endpoint: string
  options?: RequestInit
}

export const externalApiFetcher = <T>({
  apiUrl,
  endpoint,
  options
}: ExternalApiFetcherProps) => {
  return fetcher<T>(endpoint, {
    ...options,
    baseUrl: apiUrl
  })
}