"use server"

import { signIn } from "@/auth"
import { routes } from "@/routes"

export const login = async (provider: string) => {
  await signIn(provider, {
    callbackUrl: routes.defaultLoginRedirect
  })
}