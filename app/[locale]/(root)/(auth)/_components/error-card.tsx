"use client"

import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { AuthErrorCode } from "@/constants/auth-error"

import { FiAlertTriangle } from "react-icons/fi"
import { FormWrapper } from "@/components/shared/form/form-wrapper"

export const ErrorCard = () => {
  const searchParams = useSearchParams()
  const errorCode = searchParams.get("error") as AuthErrorCode
  const tUi = useTranslations("ErrorCard.ui")

  const errorHeaders: Record<AuthErrorCode, string> = {
    [AuthErrorCode.ACCESS_DENIED]: tUi("headerAccessDenied"),
    [AuthErrorCode.PROVIDER_MISMATCH]: tUi("headerProviderMismatch"),
    [AuthErrorCode.EMAIL_UNVERIFIED]: tUi("headerEmailUnverified"),
    [AuthErrorCode.UNKNOWN]: tUi("headerUnknownError"),
  }

  const errorMessages: Record<AuthErrorCode, string> = {
    [AuthErrorCode.ACCESS_DENIED]: tUi("accessDenied"),
    [AuthErrorCode.PROVIDER_MISMATCH]: tUi("providerMismatch"),
    [AuthErrorCode.EMAIL_UNVERIFIED]: tUi("emailUnverified"),
    [AuthErrorCode.UNKNOWN]: tUi("unknownError"),
  }

  const headerLabel = errorHeaders[errorCode] ?? errorHeaders[AuthErrorCode.UNKNOWN]
  const errorMessage = errorMessages[errorCode] ?? errorMessages[AuthErrorCode.UNKNOWN]

  return (
    <FormWrapper
      headerLabel={headerLabel}
      backButtonLabel={tUi("backButton")}
      backButtonHref="/signin"
    >
      <div className="w-full flex flex-col items-center">
        <FiAlertTriangle className="text-destructive" />
        <p className="text-center text-sm text-destructive">{errorMessage}</p>
      </div>
    </FormWrapper>
  )
}