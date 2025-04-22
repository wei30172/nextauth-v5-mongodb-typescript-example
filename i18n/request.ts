import { getRequestConfig } from "next-intl/server"
import { Locale, routing } from "./routing"
 
export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
 
  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as Locale)) {
    locale = routing.defaultLocale
  }
 
  return {
    locale,
    messages: (await import(`@/messages/${locale}.json`)).default,
  }
})