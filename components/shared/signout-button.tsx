"use client"

import { useRouter } from "next/navigation"
import { logout } from "@/lib/actions/auth/signout"

import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  children: React.ReactNode
}

export const SignOutButton = ({
  children
}: SignOutButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    logout()
    router.refresh()
  }

  return (
    <Button onClick={onClick} variant="destructive" className="w-full">
      {children}
    </Button>
  )
}
