import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { SessionProvider } from 'next-auth/react'
import { auth } from '@/auth'
import "./globals.css"

import ThemeProvider from "@/providers/theme-provider"
import { Navbar } from "@/components/shared/navbar"
import { Footer } from "@/components/shared/footer"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nextjs fullstack Authentication",
  description: "Sign-Up and Sign-In with Nextjs",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider session={session}>
      <html suppressHydrationWarning lang="en">
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex h-full flex-col items-center justify-center">
              {children}
            </main>
            <Footer />
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
