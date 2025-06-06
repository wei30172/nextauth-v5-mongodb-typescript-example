"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { useTranslations } from "next-intl"
import { zodResolver } from "@hookform/resolvers/zod"
import { useSession } from "next-auth/react"
import { UserRole, UserProvider } from "@/lib/database/types"
import {
  SettingsFormValues,
  getSettingsFormSchema
} from "@/lib/validations/auth"
import { settings } from "@/lib/actions/auth/settings"

import {
  Card,
  CardContent,
  CardHeader
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { FormError } from "@/components/shared/form/form-error"
import { FormSuccess } from "@/components/shared/form/form-success"
import { Skeleton } from "@/components/ui/skeleton"

export const SettingsForm = () => {
  const { data: session, status, update } = useSession({ required: true })
  const user = session?.user
  // console.log({user})

  const [error, setError] = useState<string | undefined>("")
  const [success, setSuccess] = useState<string | undefined>("")
  const [isPending, startTransition] = useTransition()

  const tUi = useTranslations("SettingsForm.ui")
  const tValidation = useTranslations("SettingsForm.validation")
  const tError = useTranslations("Common.error")

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(getSettingsFormSchema(tValidation)),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      newPassword: "",
      role: user?.role || UserRole.USER,
      isTwoFactorEnabled: user?.isTwoFactorEnabled || false
    }
  })

  async function onSubmit(values: SettingsFormValues) {
    // console.log(values)
    setError("")
    setSuccess("")

    startTransition(() => {
      settings(values)
        .then((data) => {
          if (data?.error) {
            setError(data.error)
          } else if (data?.success) {
            update()
            setSuccess(data.success)
          }
        })
        .catch(() => setError(tError("generic")))
    })
  }

  if (status === "loading") {
    return <SettingsForm.Skeleton />
  }

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          {tUi("header")}
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tUi("name")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder={tUi("name")}
                        autoComplete="username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{tUi("email")}</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending || user?.provider !== UserProvider.CREDENTIALS}
                        placeholder="mail@example.com"
                        autoComplete="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {user?.provider === UserProvider.CREDENTIALS && (
                <>
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
                </>
              )}
              {user?.provider === UserProvider.CREDENTIALS && (
                <FormField
                control={form.control}
                name="isTwoFactorEnabled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>{tUi("isTwoFactorEnabled")}</FormLabel>
                      <FormDescription>
                        {tUi("isTwoFactorEnabledDescription")}
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        disabled={isPending}
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
                />
              )}
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button
              size="lg"
              className="w-full my-6"
              type="submit"
              disabled={isPending}
            >
              {isPending ? tUi("submitting") : tUi("submit")}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

SettingsForm.Skeleton = function SkeletonSettingsForm() {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <Skeleton className="h-10 w-1/2 mx-auto my-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-6 my-6">
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </CardContent>
    </Card>
  )
}