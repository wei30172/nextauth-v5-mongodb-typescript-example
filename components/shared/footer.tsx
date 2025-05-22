import { useTranslations } from "next-intl"
import { Link } from "@/i18n/routing"
import { footerLinks } from "@/constants/nav-links"

import { SiAuth0 } from "react-icons/si"

export const Footer = () => {
  const tSection = useTranslations("Footer.ui.sections")
  const tLink = useTranslations("Footer.ui.links")
  
  return (
    <footer className="flex flex-col text-gray-500 text-sm mt-5 border-t border-gray-100">
      <div className="flex flex-wrap justify-center max-sm:flex-col gap-10 px-6 py-10 sm:gap-20">
        {footerLinks.map((section) => (
          <div key={section.sectionKey}>
            <h3 className="pb-2 font-semibold text-gray-900 dark:text-gray-200">
              {tSection(section.sectionKey)}
            </h3>
            <div className="flex flex-col gap-2">
              {section.links.map((link) => (
                <Link key={link.key} href={link.url} className="md:text-xs">
                  {tLink(link.key)}
                </Link>
              ))}
            </div>
          </div>
        ))}

      </div>
      <div className="flex flex-wrap items-center justify-between border-t border-gray-100 gap-2 px-6 py-2 sm:px-20">
        <div className="flex items-center gap-2">
          <SiAuth0 />
          <p className="text-gray-900 dark:text-gray-200">
            &copy; Web
          </p>
        </div>
        <div className="flex max-sm:flex-col gap-2 sm:gap-4">
          <Link href="/">{tLink("privacy")}</Link>
          <Link href="/">{tLink("terms")}</Link>
        </div>
      </div>
    </footer>
  )
}