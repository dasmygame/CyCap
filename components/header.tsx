'use client'

import Link from "next/link"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { UserMenu } from "@/components/user-menu"
import Image from "next/image"

export default function Header() {
  const { data: session, status } = useSession()

  return (
    <header className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src="/image-vzXu5LZ4AlMNOPucuouhPfuDvoholx-removebg-preview_enhanced.png"
              alt="Traecer Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="font-semibold">Traecer</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link href="/" className="text-sm font-medium">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/blog" className="text-sm font-medium">
              Blog
            </Link>
            <Link href="/about-us" className="text-sm font-medium">
              About Us
            </Link>
            <Link href="/discover" className="text-sm font-medium">
              Discover
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session?.user ? (
            <UserMenu user={session.user} />
          ) : (
            <>
              <Link href="/auth/sign-in" className="text-sm font-medium hidden sm:block">
                Log in
              </Link>
              <Button asChild size="sm" className="bg-[#52d3a6] hover:bg-[#52d3a6]/90">
                <Link href="/auth/sign-up">
                  Sign Up
                </Link>
              </Button>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}

