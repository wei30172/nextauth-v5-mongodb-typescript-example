export const fetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  if (!response.ok) {
    const errorMessage = await response.text()
    throw new Error(errorMessage || "An error occurred during the request.")
  }
  
  try {
    return await response.json()
  } catch (error) {
    return null
  }
}
