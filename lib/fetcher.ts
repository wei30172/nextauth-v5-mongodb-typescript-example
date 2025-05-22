import jwt from "jsonwebtoken"

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
  authStrategy?: AuthStrategy // "internal-key" is default
  serviceName?: string // optional for bearer token payload
}

export const internalApiFetcher = <T>({
  endpoint,
  options,
  authStrategy = "internal-key",
  serviceName = "internal-service"
}: InternalApiFetcherProps) => {
  const headers: Record<string, string> = {
    ...(options?.headers as Record<string, string>)
  }
  
  if (authStrategy === "internal-key") {
    headers["x-internal-key"] = process.env.INTERNAL_API_KEY!
  } else {
    const token = jwt.sign(
      { service: serviceName },
      process.env.INTERNAL_API_SECRET!,
      { expiresIn: "10m" }
    )
    headers["Authorization"] = `Bearer ${token}`
  }

  return fetcher<T>(endpoint, {
    ...options,
    headers,
    baseUrl: process.env.NEXT_PUBLIC_APP_URL
  })
}

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