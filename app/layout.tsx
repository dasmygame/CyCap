import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/providers/theme-provider"
import { Providers } from "./providers"
import Header from "@/components/header"
import AnnouncementBanner from "@/components/announcement-banner"
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Toaster } from '@/components/ui/toaster'
import { SidebarNav } from '@/components/sidebar-nav'

const inter = Inter({ subsets: ['latin'] })
// const poppins = Poppins({
//   weight: ['400', '500', '600', '700'],
//   subsets: ['latin'],
//   display: 'swap',
// })

export const metadata: Metadata = {
  title: "Traecer - Trade Smarter, Execute Faster",
  description: "Real-time trading platform for your community. Portfolio tracking, transparency, and one-click copy trades.",
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  return (
    <html lang="en" suppressHydrationWarning className={inter.className}>
      <body className="min-h-screen bg-background antialiased">
        <Providers>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AnnouncementBanner />
            <Header />
            <div className="relative">
              {session?.user && <SidebarNav />}
              <main className="min-h-[calc(100vh-64px)]">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </Providers>
        <Toaster />
      </body>
    </html>
  )
}

