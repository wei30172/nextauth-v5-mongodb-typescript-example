import { Account, Profile } from "next-auth"
import { internalApiFetcher } from "@/lib/fetcher"
import { IUser } from "@/lib/database/models/types"

export const getUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: `api/user?email=${encodeURIComponent(email)}`,
      options: { method: "GET" }
    })
    // console.log({user})

    return user ?? null
  } catch {
    return null
  }
}

export const getUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: `api/user/${id}`,
      options: { method: "GET" }
    })
    // console.log({user})
    
    return user ?? null
  } catch {
    return null
  }
}

interface SignInWithOauthParams {
  account: Account
  profile: Profile & { picture?: string }
}

export const signInWithOauth = async (
  params: SignInWithOauthParams
): Promise<boolean> => {
  const { account, profile } = params
  // console.log({account, profile})

  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: "api/user/oauth",
      options: {
        method: "PUT",
        body: JSON.stringify({account, profile})
      }
    })
    // console.log({user})

    return !!user
  } catch {
    return false
  }
}