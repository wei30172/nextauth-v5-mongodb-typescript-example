import { internalApiFetcher } from "@/lib/fetcher"
import { TwoFactorConfirmation } from "@/lib/database/models/types"

export const fetchConfirmationByUserId = async (
  userId: string
): Promise<TwoFactorConfirmation | null> => {
  try {
    const confirmation = await internalApiFetcher<TwoFactorConfirmation>({
      endpoint: "api/twofac/fetch-by-userId",
      options: {
        method: "POST",
        body: JSON.stringify({ userId })
      }
    })
    // console.log({confirmation})
    return confirmation ?? null
  } catch {
    return null
  }
}

export const deleteConfirmationById = async (id: string) => {
  await internalApiFetcher<void>({
    endpoint: "api/twofac/delete-by-id",
    options: {
      method: "DELETE",
      body: JSON.stringify({ id })
    }
  })
}