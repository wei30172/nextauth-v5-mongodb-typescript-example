"use client"

import { logout } from "@/lib/actions/auth/signout"
import { routes } from "@/routes"

import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  children: React.ReactNode
}

export const SignOutButton = ({
  children
}: SignOutButtonProps) => {
  const handleClick = async() => {
    await logout()
    window.location.assign(routes.defaultLogoutRedirect)
  }

  return (
    <Button onClick={handleClick} variant="destructive" className="w-full">
      {children}
    </Button>
  )
}
