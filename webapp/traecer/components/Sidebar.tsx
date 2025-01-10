'use client'

import Link from 'next/link'
import { Home, LineChart, Newspaper, BarChart2, DollarSign, BookOpen, Headphones, PlayCircle, Users, Briefcase, Search, ScrollText, Star, Crown } from 'lucide-react'

const mainNavItems = [
  { icon: Home, label: 'Home', href: '/dashboard' },
  { icon: LineChart, label: 'Stock Analysis', href: '/dashboard/stocks' },
  { icon: Newspaper, label: 'Market News', href: '/dashboard/news' },
  { icon: BarChart2, label: 'Market Data', href: '/dashboard/market-data' },
  { icon: DollarSign, label: 'Dividends', href: '/dashboard/dividends' },
  { icon: BookOpen, label: 'Education', href: '/dashboard/education' },
  { icon: Headphones, label: 'Podcasts', href: '/dashboard/podcasts' },
  { icon: PlayCircle, label: 'Videos', href: '/dashboard/videos' },
]

const portfolioItems = [
  { label: 'Overview', href: '/dashboard/portfolio' },
  { label: 'Create Portfolio', href: '/dashboard/portfolio/create' },
  { label: 'Portfolio Health Check', href: '/dashboard/portfolio/health' },
  { label: 'About Portfolio', href: '/dashboard/portfolio/about' },
]

const findAndCompareItems = [
  { label: 'Stock Screener', href: '/dashboard/screener/stocks' },
  { label: 'ETF Screener', href: '/dashboard/screener/etf' },
  { label: 'Comparisons', href: '/dashboard/comparisons' },
]

const subscriptionItems = [
  { label: 'Alpha Picks', href: '/dashboard/alpha-picks' },
  { label: 'Premium & Pro', href: '/dashboard/premium' },
  { label: 'Group Subscriptions', href: '/dashboard/groups' },
]

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-black border-r border-neutral-800 text-white overflow-y-auto">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-2 mb-10">
          <span className="text-2xl font-light tracking-tight">CYCAP</span>
        </Link>

        {/* Quick Actions */}
        <div className="space-y-2 mb-10">
          <Link 
            href="/register" 
            className="flex items-center space-x-2 px-4 py-2 bg-[#00FF7F] text-black font-medium hover:bg-[#00FF7F]/90 transition-colors"
          >
            <Users size={18} />
            <span className="text-sm">Create Free Account</span>
          </Link>
          <Link 
            href="/premium" 
            className="flex items-center space-x-2 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 transition-colors"
          >
            <Crown size={18} />
            <span className="text-sm">About Premium</span>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="space-y-8">
          <div className="space-y-1">
            {mainNavItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-900 transition-colors text-sm"
              >
                <item.icon size={16} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Investing Groups */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-neutral-500 tracking-wider uppercase">Investing Groups</div>
            <Link
              href="/dashboard/explore"
              className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-900 transition-colors text-sm"
            >
              <Users size={16} />
              <span>Explore Investing Groups</span>
            </Link>
          </div>

          {/* Portfolios */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-neutral-500 tracking-wider uppercase">Portfolios</div>
            <div className="space-y-1">
              {portfolioItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-900 transition-colors text-sm"
                >
                  <Briefcase size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Find & Compare */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-neutral-500 tracking-wider uppercase">Find & Compare</div>
            <div className="space-y-1">
              {findAndCompareItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-900 transition-colors text-sm"
                >
                  <Search size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Subscriptions */}
          <div>
            <div className="px-4 py-2 text-xs font-medium text-neutral-500 tracking-wider uppercase">Subscriptions</div>
            <div className="space-y-1">
              {subscriptionItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-neutral-900 transition-colors text-sm"
                >
                  <Star size={16} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </nav>
      </div>
    </div>
  )
}

