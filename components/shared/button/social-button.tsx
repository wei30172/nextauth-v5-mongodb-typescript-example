"use client"

import { login } from "@/lib/actions/auth/signIn"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"

export const SocialButton = () => {
  const onClick = (provider: "google") => login(provider)

  return (
    <div className="flex items-center w-full gap-x-2">
      <Button
        size="lg"
        className="w-full"
        variant="outline"
        onClick={() => onClick("google")}
      >
        <FcGoogle className="h-4 w-4" />
      </Button>
    </div>
  )
}