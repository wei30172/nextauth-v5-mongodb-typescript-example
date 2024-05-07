import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const fetcher = async (url: string, options: RequestInit = {}): Promise<any> => {
  const headers = {
    "Content-Type": "application/json",
    ...options.headers
  }

  const response = await fetch(url, {
    ...options,
    headers
  })

  try {
    return await response.json()
  } catch (error) {
    return null
  }
}
