"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { useSearchParams } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  NewPasswordFormValues,
  getNewPasswordFormSchema
} from "@/lib/validations/auth"
import { newPassword } from "@/lib/actions/auth/new-password"

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

export const NewPasswordForm = () => {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("NewPasswordForm.ui")
  const tValidation = useTranslations("NewPasswordForm.validation")
  const tError = useTranslations("Common.error")

  const form = useForm<NewPasswordFormValues>({
    resolver: zodResolver(getNewPasswordFormSchema(tValidation)),
    defaultValues: {
      newPassword: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: NewPasswordFormValues) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      newPassword(values, token)
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
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUi("newPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      placeholder={tUi("newPassword")}
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{tUi("confirmPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      type="password"
                      placeholder={tUi("confirmPassword")}
                      autoComplete="new-password"
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