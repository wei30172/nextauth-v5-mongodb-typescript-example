import Link from "next/link"

import { currentUser } from "@/lib/session"

import { SiAuth0 } from "react-icons/si"
import { MainNav } from "@/components/shared/main-nav"
import { ModeToggle } from "@/components/shared/mode-toggle"
import { AuthLink } from "@/components/shared/user-button"

export const Navbar = async () => {
  const user = await currentUser()

  return (
    <header className="w-full fixed z-10 top-0 bg-gray-100 dark:bg-gray-900 border-b border-gray-200">
      <nav className="h-16 px-4 flex items-center">
        <Link href="/">
          <SiAuth0 />
        </Link>
        <MainNav />
        <div className="ml-auto flex items-center space-x-4">
          <AuthLink isSignedIn={user ? true : false} />
          <ModeToggle />
        </div>
      </nav>
    </header>
  )
}