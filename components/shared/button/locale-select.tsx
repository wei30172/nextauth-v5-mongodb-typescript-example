"use client"

import { useSearchParams } from "next/navigation"
import { Locale, routing, usePathname, useRouter } from "@/i18n/routing"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


const localeLabelMap: Record<Locale, string> = {
  en: "English",
  zh: "繁體中文",
}

export default function LocaleSelect({ value, label }: {
  value: string
  label: string
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function onSelectChange(nextLocale: string) {
    if (nextLocale !== value) {
      router.replace(
        {
          pathname,
          query: Object.fromEntries(searchParams.entries())
        },
        { locale: nextLocale as Locale }
      )
    }
  }

  return (
    <Select value={value} onValueChange={onSelectChange}>
      <SelectTrigger
        className="focus:ring-0 focus:ring-offset-0"
        aria-label={label}
        title={label}
      >
        <SelectValue placeholder="Select locale" />
      </SelectTrigger>
      <SelectContent>
        {routing.locales.map((locale) => (
          <SelectItem key={locale} value={locale}>
            {localeLabelMap[locale as Locale] ?? locale.toUpperCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
