import { createNavigation } from "next-intl/navigation"
import { defineRouting } from "next-intl/routing"

export const routing = defineRouting({
  // Supported locales
  locales: ["en", "zh"],
  // Default locale
  defaultLocale: "en",
})

export type Locale = (typeof routing.locales)[number]
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)