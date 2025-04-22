"use client"

import { IoIosGlobe } from "react-icons/io"
import { useLocale } from "next-intl"
import LocaleSelect from "./locale-select"

export const LocaleSwitcher = () => {
  const locale = useLocale()

  return (
    <div className="flex items-center gap-2">
      <IoIosGlobe className="h-8 w-8 text-muted-foreground" />
      <LocaleSelect value={locale} label="Select a locale" />
    </div>
  )
}