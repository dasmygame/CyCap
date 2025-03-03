'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function AnnouncementBanner() {
  const { scrollY } = useScroll()
  const pathname = usePathname()
  
  const opacity = useTransform(scrollY, [0, 80], [1, 0])
  const height = useTransform(scrollY, [0, 80], ['40px', '0px'])
  const marginTop = useTransform(scrollY, [0, 80], ['0px', '-40px'])
  const display = useTransform(scrollY, (value) => value >= 80 ? 'none' : 'block')

  // Only show on home page
  if (pathname !== '/') return null

  return (
    <motion.div
      style={{ height, marginTop, opacity, display }}
      className="fixed top-0 left-0 right-0 w-full bg-gradient-to-r from-primary/90 via-primary to-primary/90 text-primary-foreground overflow-hidden z-[60]"
    >
      <Link 
        href="/market-report"
        className="h-[40px] flex items-center justify-center text-sm font-medium hover:opacity-90 transition-opacity"
      >
        <span>Latest Market Report: Q1 2024 Trading Insights</span>
        <ChevronRight className="ml-2 h-4 w-4" />
      </Link>
    </motion.div>
  )
} 