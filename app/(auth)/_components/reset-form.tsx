"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { ResetPasswordValidation } from "@/lib/validations/auth"
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
import { FormError } from "@/components/shared/form-error"
import { FormSuccess } from "@/components/shared/form-success"
import { FormWrapper } from "@/components/shared/form-wrapper"

export const ResetForm = () => {
  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const form = useForm<z.infer<typeof ResetPasswordValidation>>({
    resolver: zodResolver(ResetPasswordValidation),
    defaultValues: {
      email: ""
    }
  })

  async function onSubmit(values: z.infer<typeof ResetPasswordValidation>) {
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
        .catch(() => setError("Something went wrong"))
    })
  }

  return (
    <FormWrapper
      headerLabel="Forgot your password?"
      backButtonLabel="Back to sign in"
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="mail@example.com"
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
            {isPending ? "Sending..." : "Send reset email"}
          </Button>
        </form>
      </Form>
    </FormWrapper>
  )
}