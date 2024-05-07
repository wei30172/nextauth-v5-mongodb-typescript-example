import { fetcher } from "@/lib/utils"

export const fetchConfirmationByUserId = async (
  userId: string
) => {
  try {
    const twoFactorConfirmation = await fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/twofac/fetch-by-userId`, {
      method: "POST",
      body: JSON.stringify({userId})
    })
    // console.log({twoFactorConfirmation})
    
    if (twoFactorConfirmation) return twoFactorConfirmation

    return null
  } catch {
    return null
  }
}

export const deleteConfirmationById = async (
  id: string
) => {
  await fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/twofac/delete-by-id`, {
    method: "DELETE",
    body: JSON.stringify({id})
  })
}
