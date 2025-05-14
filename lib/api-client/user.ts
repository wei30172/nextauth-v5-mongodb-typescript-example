import { Account, Profile } from "next-auth"
import { internalApiFetcher } from "@/lib/fetcher"
import { IUser } from "@/lib/database/models/types"

export const fetchUserByEmail = async (email: string): Promise<IUser | null> => {
  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: "api/user/fetch-by-email",
      options: {
        method: "POST",
        body: JSON.stringify({ email })
      }
    })
    // console.log({user})

    return user ?? null
  } catch {
    return null
  }
}

export const fetchUserById = async (id: string): Promise<IUser | null> => {
  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: "api/user/fetch-by-id",
      options: {
        method: "POST",
        body: JSON.stringify({ id })
      }
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

export const signInWithOauth = async (params: SignInWithOauthParams): Promise<boolean> => {
  const { account, profile } = params
  // console.log({account, profile})

  try {
    const user = await internalApiFetcher<IUser>({
      endpoint: "api/user/signIn-with-oauth",
      options: {
        method: "POST",
        body: JSON.stringify({account, profile})
      }
    })
    // console.log({user})

    return !!user
  } catch {
    return false
  }
}