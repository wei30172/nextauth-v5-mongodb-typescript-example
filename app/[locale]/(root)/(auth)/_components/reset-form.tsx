"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  ResetPasswordFormValues,
  getResetPasswordFormSchema
} from "@/lib/validations/auth"
import { resetPassword } from "@/lib/actions/auth/reset-password"

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

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("ResetForm.ui")
  const tValidation = useTranslations("ResetForm.validation")
  const tError = useTranslations("Common.error")

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(getResetPasswordFormSchema(tValidation)),
    defaultValues: {
      email: ""
    }
  })

  async function onSubmit(values: ResetPasswordFormValues) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      resetPassword(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            setSuccess(data.success)
          }
        })
        .catch(() => setError(tError("generic")))
    })
  }

  return (
    <FormWrapper
      headerLabel={tUi("header")}
      backButtonLabel={tUi("backButton")}
      backButtonHref="/signin"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-4">
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
          </div>
          <FormError message={error} />
          <FormSuccess message={success} />
          <Button
            size="lg"
            className="w-full mt-6"
            type="submit"
            disabled={isPending}
          >
            {isPending ? tUi("submitting") : tUi("submit")}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}