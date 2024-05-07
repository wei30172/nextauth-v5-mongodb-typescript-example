"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"
import { useCurrentUser } from "@/hooks/use-session"

import { FaRegUserCircle } from "react-icons/fa"
import { IoMdLogIn, IoMdLogOut } from "react-icons/io"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu"
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from "@/components/ui/avatar"
import { SignInButton } from "@/components/shared/signin-button"
import { SignOutButton } from "@/components/shared/signout-button"

interface NavLink {
  title: string
  url: string
}

interface UserNavLinksProps {
  userNavLinks: NavLink[]
  pathName: string
}

const UserNavLinks = ({
  userNavLinks,
  pathName
}:  UserNavLinksProps) => (
  userNavLinks.map((link) => (
    <DropdownMenuItem key={link.title}>
      <Link
        href={link.url}
        className={cn(
          "py-2 text-sm transition-colors",
          pathName === link.url ? "text-black dark:text-white" : "text-muted-foreground"
        )}
      >
        {link.title}
      </Link>
    </DropdownMenuItem>
  ))
)

export const AuthLink = ({ isSignedIn = false }) => (
  isSignedIn ? (
    <SignOutButton>
      <IoMdLogOut className="h-4 w-4 mr-2"/>
      Sign Out
    </SignOutButton>
  ) : (
    <SignInButton>
      <IoMdLogIn className="h-4 w-4 mr-2"/>
      Sign In
    </SignInButton>
  )
)

export const UserButton = () => {
  const pathName = usePathname()
  const user = useCurrentUser()
  // console.log({user})

  const userNavLinks = [
    { title: "Settings", url: "/settings" }
  ]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarImage src={user?.image || ""} />
          <AvatarFallback className="bg-primary-500">
            <FaRegUserCircle className="h-6 w-6"/>
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40" align="end">
      {user && (
      <>
        <UserNavLinks userNavLinks={userNavLinks} pathName={pathName}/>
        <DropdownMenuSeparator />
      </>
      )}
        <DropdownMenuItem>
          <AuthLink isSignedIn={user ? true : false} />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
