"use client"

import { 
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card"
import { FormHeader } from "@/components/shared/form/form-header"
import { SocialButton } from "@/components/shared/button/social-button"
import { BackButton } from "@/components/shared/button/back-button"

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
        <FormHeader label={headerLabel} />
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