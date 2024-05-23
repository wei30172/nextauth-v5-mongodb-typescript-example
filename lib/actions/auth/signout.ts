"use server"

import { signOut } from "@/auth"
import { routes } from "@/routes"

export const logout = async () => {
  await signOut({
    redirect: false
  })
}
