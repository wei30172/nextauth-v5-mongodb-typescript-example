import { internalApiFetcher } from "@/lib/fetcher"
import { ITwoFactorConfirmation } from "@/lib/database/models/types"

export const fetchConfirmationByUserId = async (
  userId: string
): Promise<ITwoFactorConfirmation | null> => {
  try {
    const confirmation = await internalApiFetcher<ITwoFactorConfirmation>({
      endpoint: `api/twofac/user/${userId}`,
      options: { method: "GET" }
    })
    // console.log({confirmation})
    return confirmation ?? null
  } catch {
    return null
  }
}

export const deleteConfirmationById = async (id: string) => {
  await internalApiFetcher<void>({
    endpoint: `api/twofac/${id}`,
    options: { method: "DELETE" }
  })
}