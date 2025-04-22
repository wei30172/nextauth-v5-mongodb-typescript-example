"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { mainNavLinks } from "@/constants"

import { AiOutlineMenu } from "react-icons/ai"

export const MainNav = () => {
  const tLink = useTranslations("Navbar.ui.links")
  const [menuOpen, setMenuOpen] = useState(false)
  const pathName = usePathname()

  return (
    <div className="flex items-center lg:space-x-6 mx-4">
      <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden">
        <AiOutlineMenu />
      </button>
      <div className={cn(
        "absolute top-full left-0 w-full border bg-gray-100 dark:bg-gray-900",
        "lg:border-none lg:static lg:flex lg:space-x-6",
        menuOpen ? "block" : "hidden"
      )}>
        {
          mainNavLinks.map((link) => (
            <Link
              key={link.key}
              href={link.url}
              className={cn(
                "block py-2 px-4 text-sm transition-colors",
                pathName === link.url ? "text-black dark:text-white" : "text-muted-foreground"
              )}
            >
              {tLink(link.key)}
            </Link>
          ))
        }
      </div>
    </div>
  )
}