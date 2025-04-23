"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useTranslations } from "next-intl"
import { newVerification } from "@/lib/actions/auth/new-verification"

import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { FormWrapper } from "@/components/shared/form/form-wrapper"
import { Spinner } from "@/components/shared/spinner"

export const NewVerificationForm = () => {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  
  const tUi = useTranslations("NewVerificationForm.ui")
  const tError = useTranslations("Common.error")

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    // console.log(token)
    if (success || error) return

    if (!token) {
      setError(tError("missingToken"))
      return
    }

    newVerification(token)
      .then((data) => {
        if (data?.error) {
          setError(data.error)
        } else if (data?.success) {
          setSuccess(data.success)
        }
      })
      .catch(() => setError(tError("generic")))
  }, [token, success, error, tError])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <FormWrapper
      headerLabel={tUi("header")}
      backButtonLabel={tUi("backButton")}
      backButtonHref="/signin"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <Spinner />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
      </div>
    </FormWrapper>
  )
}