"use client"

import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { IoMdMoon } from "react-icons/io"
import { IoMdSunny } from "react-icons/io"

export const ModeToggle = () => {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light")
    } else {
      setTheme("dark")
    }
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme}>
      <IoMdSunny className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <IoMdMoon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}