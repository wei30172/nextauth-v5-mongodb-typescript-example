interface FetcherOptions extends RequestInit {
  baseUrl?: string
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
interface InternalApiFetcherProps {
  endpoint: string
  options?: RequestInit
}

export const internalApiFetcher = <T>({
  endpoint,
  options
}: InternalApiFetcherProps) => {
  return fetcher<T>(endpoint, {
    ...options,
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