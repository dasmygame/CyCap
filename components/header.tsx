'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './mode-toggle'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { UserMenu } from './user-menu'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

export default function Header() {
  const { scrollY } = useScroll()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { data: session, status } = useSession()
  const pathname = usePathname()

  useEffect(() => {
    setMounted(true)
  }, [])

  const headerBg = useTransform(
    scrollY,
    [0, 80],
    mounted && theme === 'dark'
      ? ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.7)']
      : ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.9)']
  )
  
  const headerTop = useTransform(
    scrollY,
    [0, 80],
    pathname === '/' ? ['40px', '0px'] : ['0px', '0px']
  )

  return (
    <motion.header
      style={{ 
        backgroundColor: headerBg, 
        top: headerTop
      }}
      className="fixed left-0 right-0 z-50 backdrop-blur-sm transition-colors"
    >
      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/image-vzXu5LZ4AlMNOPucuouhPfuDvoholx-removebg-preview_enhanced.png"
              alt="Traecer Logo"
              width={40}
              height={40}
              className="h-10 w-10"
            />
            <span className="text-xl font-semibold">Traecer</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link href="/features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="/blog" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Blog
            </Link>
            <Link href="/about-us" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              About Us
            </Link>
            <Link href="/discover" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
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
              <Link href="/auth/sign-in" className="hidden md:inline-flex">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link href="/auth/sign-up">
                <Button className="bg-[#52d3a6] hover:bg-[#52d3a6]/90">Sign Up</Button>
              </Link>
            </>
          )}
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  )
}

