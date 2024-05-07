"use client"

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import { Header } from "@/components/shared/header"
import { SocialButton } from "@/components/shared/social-button"
import { BackButton } from "@/components/shared/back-button"

interface FormWrapperProps {
  children: React.ReactNode
  headerLabel: string
  backButtonLabel: string
  backButtonHref: string
  showSocial?: boolean
}

export const FormWrapper = ({
  children,
  headerLabel,
  backButtonLabel,
  backButtonHref,
  showSocial
}: FormWrapperProps) => {
  return (
    <Card className="w-[360px] shadow-md">
      <CardHeader>
        <Header label={headerLabel} />
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      {showSocial && (
        <CardFooter>
          <SocialButton />
        </CardFooter>
      )}
      <CardFooter>
        <BackButton
          label={backButtonLabel}
          href={backButtonHref}
        />
      </CardFooter>
    </Card>
  )
}