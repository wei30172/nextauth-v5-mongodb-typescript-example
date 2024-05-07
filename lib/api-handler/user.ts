import { Account, Profile } from "next-auth"
import { fetcher } from "@/lib/utils"

export const fetchUserByEmail = async (email: string) => {
  try {
    const user = await fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/fetch-by-email`, {
      method: "POST",
      body: JSON.stringify({email})
    })
    // console.log({user})
    
    if (user) return user
    
    return null
  } catch {
    return null
  }
}

export const fetchUserById = async (id: string) => {
  try {
    const user = await fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/fetch-by-id`, {
      method: "POST",
      body: JSON.stringify({id})
    })
    // console.log({user})

    if (user) return user
    
    return null
  } catch {
    return null
  }
}

type SignInWithOauthInput = {account: Account, profile: Profile & { picture?: string }}

export const signInWithOauth = async (values: SignInWithOauthInput) => {
  const { account, profile } = values
  // console.log({account, profile})

  const user = await fetcher(`${process.env.NEXT_PUBLIC_APP_URL}/api/user/signIn-with-oauth`, {
    method: "POST",
    body: JSON.stringify({account, profile})
  })
  // console.log({user})

  return !!user
}