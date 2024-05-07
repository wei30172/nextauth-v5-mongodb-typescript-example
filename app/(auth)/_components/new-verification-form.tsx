"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { newVerification } from "@/lib/actions/auth/new-verification"

import { FormError } from "@/components/shared/form-error"
import { FormSuccess } from "@/components/shared/form-success"
import { FormWrapper } from "@/components/shared/form-wrapper"
import { Loader } from "@/components/shared/loader"

export const NewVerificationForm = () => {
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")

  const token = searchParams.get("token")

  const onSubmit = useCallback(() => {
    // console.log(token)
    if (success || error) return

    if (!token) {
      setError("Missing token!")
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
      .catch(() => setError("Something went wrong"))
  }, [token, success, error])

  useEffect(() => {
    onSubmit()
  }, [onSubmit])

  return (
    <FormWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/signin"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && (
          <Loader />
        )}
        <FormSuccess message={success} />
        {!success && (
          <FormError message={error} />
        )}
      </div>
    </FormWrapper>
  )
}