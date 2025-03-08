'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Switch } from '@/components/ui/switch'
import { useTheme } from 'next-themes'
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  LineChart,
  MessageSquare,
  Settings,
  Users,
  Wallet,
  Moon,
  Sun
} from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'

interface SidebarNavProps {
  className?: string
}

interface Trace {
  _id: string
  slug: string
  name: string
  avatar?: string
}

export function SidebarNav({ className }: SidebarNavProps) {
  const pathname = usePathname()
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [traces, setTraces] = useState<Trace[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const fetchTraces = async () => {
      try {
        const response = await fetch('/api/traces/joined')
        if (!response.ok) throw new Error('Failed to fetch traces')
        const data = await response.json()
        setTraces(data.traces)
      } catch (error) {
        console.error('Error fetching traces:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTraces()
  }, [])

  const mainNavItems = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Analytics',
      href: '/analytics',
      icon: LineChart
    },
    {
      title: 'Messages',
      href: '/messages',
      icon: MessageSquare
    },
    {
      title: 'Community',
      href: '/community',
      icon: Users
    },
    {
      title: 'Portfolio',
      href: '/portfolio',
      icon: Wallet
    }
  ]

  return (
    <div className="fixed left-0 top-[calc(64px+4rem)] h-[calc(100vh-64px-8rem)] z-50">
      <div
        className={cn(
          'group relative flex flex-col rounded-r-2xl border border-l-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/75 shadow-[4px_0_16px_-1px_rgba(0,0,0,0.1)] transition-all duration-300 ease-in-out h-full',
          isCollapsed ? 'w-[60px]' : 'w-[240px]',
          className
        )}
      >
        {/* Collapse Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-3 z-20 h-6 w-6 rounded-full border bg-background shadow-sm"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
          <span className="sr-only">Toggle Sidebar</span>
        </Button>

        {/* Main Navigation */}
        <ScrollArea className="flex-1">
          <div className="space-y-4 py-4">
            <nav className="grid gap-1 px-2">
              {mainNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                    pathname === item.href ? 'bg-accent' : 'transparent',
                    isCollapsed && 'justify-center'
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {!isCollapsed && <span>{item.title}</span>}
                </Link>
              ))}
            </nav>

            {/* Joined Traces */}
            <div>
              <div className={cn(
                'mb-2 px-4 text-xs font-semibold text-muted-foreground',
                isCollapsed && 'text-center'
              )}>
                {!isCollapsed && 'JOINED TRACES'}
              </div>
              <nav className="grid gap-1 px-2">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="px-3 py-2">
                      <Skeleton className="h-8 w-full" />
                    </div>
                  ))
                ) : (
                  traces.map((trace) => (
                    <Link
                      key={trace._id}
                      href={`/t/${trace.slug}`}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
                        pathname === `/t/${trace.slug}` ? 'bg-accent' : 'transparent',
                        isCollapsed && 'justify-center'
                      )}
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={trace.avatar} />
                        <AvatarFallback>{trace.name[0]}</AvatarFallback>
                      </Avatar>
                      {!isCollapsed && (
                        <span className="truncate">{trace.name}</span>
                      )}
                    </Link>
                  ))
                )}
              </nav>
            </div>
          </div>
        </ScrollArea>

        {/* Footer with Settings and Theme Toggle */}
        <div className="border-t p-2 space-y-2">
          {/* Theme Toggle */}
          <div className={cn(
            'flex items-center rounded-lg px-3 py-2 text-sm',
            isCollapsed ? 'justify-center' : 'justify-between'
          )}>
            <div className="flex items-center gap-2">
              {!isCollapsed && <span>Dark Mode</span>}
            </div>
            {isCollapsed ? (
              theme === 'dark' ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )
            ) : (
              <div className="flex items-center gap-2">
                <Switch
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
                {theme === 'dark' ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
              </div>
            )}
          </div>

          {/* Settings Link */}
          <Link
            href="/settings"
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-all hover:bg-accent',
              pathname === '/settings' ? 'bg-accent' : 'transparent',
              isCollapsed && 'justify-center'
            )}
          >
            <Settings className="h-4 w-4" />
            {!isCollapsed && <span>Settings</span>}
          </Link>
        </div>
      </div>
    </div>
  )
} 