import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs))

export const cleanEmptyStrings = <T extends Record<string, any>>(obj: T): T => {
  const result = { ...obj }

  for (const key of Object.keys(result) as (keyof T)[]) {
    const value = result[key]
    if (typeof value === "string" && value.trim() === "") {
      result[key] = undefined as any
    }
  }

  return result
}
