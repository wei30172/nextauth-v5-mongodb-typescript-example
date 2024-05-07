"use client"

import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SignInForm } from "@/app/(auth)/_components/signin-form"

interface SignInButtonProps {
  children: React.ReactNode
  mode?: "modal" | "redirect",
  asChild?: boolean
}

export const SignInButton = ({
  children,
  mode = "redirect",
  asChild
}: SignInButtonProps) => {
  const router = useRouter()

  const onClick = () => {
    router.push("/signin")
  }

  if (mode === "modal") {
    return (
      <Dialog>
        <DialogTrigger asChild={asChild}>
          {children}
        </DialogTrigger>
        <DialogContent className="p-0 w-auto bg-transparent border-none">
          <SignInForm />
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Button onClick={onClick}>
      {children}
    </Button>
  )
}