"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"

interface SignInButtonProps {
  children: React.ReactNode
}

export const SignInButton = ({
  children
}: SignInButtonProps) => {
  const router = useRouter()

  const onClick = () => router.push("/signin")

  return (
    <Button onClick={onClick} className="w-full">
      {children}
    </Button>
  )
}