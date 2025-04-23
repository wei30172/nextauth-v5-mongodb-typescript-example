"use client"

import { useState, useTransition } from "react"
import { useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  SignInFormValues,
  getSignInFormSchema
} from "@/lib/validations/auth"
import { signInWithCredentials } from "@/lib/actions/auth/signin-with-credentials"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { FormWrapper } from "@/components/shared/form/form-wrapper"

export const SignInForm = () => {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl")
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [showTwoFactor, setShowTwoFactor] = useState(false)
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("SignInForm.ui")
  const tValidation = useTranslations("SignInForm.validation")
  const tError = useTranslations("Common.error")

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(getSignInFormSchema(tValidation)),
    defaultValues: {
      email: "",
      password: "",
      code: "",
    }
  })

  async function onSubmit(values: SignInFormValues) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      signInWithCredentials(values, callbackUrl)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            setSuccess(data.success)
          } else if (data?.url) {
            window.location.assign(data?.url)
          }

          if (data?.twoFactor) {
            setShowTwoFactor(true)
          }
        })
        .catch(() => setError(tError("generic")))
    })
  }

  return (
    <FormWrapper
      headerLabel={tUi("header")}
      backButtonLabel={tUi("backButton")}
      backButtonHref="/signup"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
            {showTwoFactor && (
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tUi("code")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="123456"
                        autoComplete="one-time-code"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            {!showTwoFactor && (
            <>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tUi("email")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="mail@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tUi("password")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        type="password"
                        placeholder={tUi("password")}
                        autoComplete="current-password"
                        {...field}
                      />
                    </FormControl>
                    <Button
                      size="sm"
                      variant="link"
                      asChild
                      className="px-0 font-normal"
                    >
                      <Link href="/reset">
                        {tUi("resetLink")}
                      </Link>
                    </Button>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            size="lg"
            className="w-full mt-6"
            type="submit"
            disabled={isPending}
          >
            {isPending ? tUi("submitting") : showTwoFactor ? tUi("confirm") : tUi("submit")}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}