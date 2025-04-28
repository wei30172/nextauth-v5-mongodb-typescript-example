"use client"

import { Link } from "@/i18n/routing"

import { Button } from "@/components/ui/button"

interface BackButtonProps {
  href: string
  label: string
}

export const BackButton = ({
  href,
  label,
}: BackButtonProps) => {
  return (
    <Button
      variant="link"
      className="w-full"
      size="lg"
      asChild
    >
      <Link href={href}>
        {label}
      </Link>
    </Button>
  )
}