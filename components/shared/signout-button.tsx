"use client"

import { logout } from "@/lib/actions/auth/signout"

import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  children: React.ReactNode
}

export const SignOutButton = ({
  children
}: SignOutButtonProps) => {
  const onClick = () => logout()

  return (
    <Button onClick={onClick} variant="destructive">
      {children}
    </Button>
  )
}
