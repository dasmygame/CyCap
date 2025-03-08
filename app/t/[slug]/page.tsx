'use client'

import { Suspense } from 'react'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageContainer } from '@/components/page-container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LiveChat } from './_components/live-chat'
import { OpenPositions } from './_components/open-positions'
import { TraceAnalytics } from './_components/analytics'
import { TradeAlerts } from './_components/trade-alerts'
import { Members } from './_components/members'
import { TraceStorefront } from './_components/trace-storefront'
import { AdminPanelButton } from './_components/admin-panel-button'
import { AdminMenu } from './_components/admin-menu'
import { UserSettings } from './_components/user-settings'
import { getUserTraceRole } from '@/lib/utils/permissions'
import type { TraceRole } from '@/lib/utils/permissions'
import { ITracePosition, ITraceAlert, PerformanceMetrics } from '@/lib/models/types'

interface TraceData {
  _id: string
  slug: string
  name: string
  description: string
  price: number
  features: string[]
  coverImage?: string
  avatar?: string
  tags: string[]
  createdBy: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  stats: {
    memberCount: number
    tradeAlertCount: number
    messageCount: number
    totalTrades: number
    winRate: number
    profitFactor: number
    averageRR: number
    totalPnL: number
    bestTrade: number
    worstTrade: number
    averageDuration: string
  }
  openPositions: Omit<ITracePosition, 'performance' | 'risk' | 'metadata'>[]
  recentAlerts: Omit<ITraceAlert, 'createdAt' | 'updatedAt'>[]
  performance: PerformanceMetrics
  members: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }[]
  moderators: {
    _id: string
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export default function TracePage({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [trace, setTrace] = useState<TraceData | null>(null)
  const [isMember, setIsMember] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch trace data
  useEffect(() => {
    const fetchTrace = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/traces/${params.slug}/membership`)
        const data = await response.json()
        
        if (!data.trace) {
          console.error('Trace not found')
          setTrace(null)
          return
        }

        // Initialize missing arrays to prevent undefined errors
        const trace = {
          ...data.trace,
          moderators: data.trace.moderators || [],
          members: data.trace.members || [],
          features: data.trace.features || [
            'Access to live chat and community',
            'Real-time trade alerts',
            'Performance analytics',
            'Open positions tracking',
            'Direct communication with trace owner'
          ],
          tags: data.trace.tags || [],
          openPositions: data.trace.openPositions || [],
          recentAlerts: data.trace.recentAlerts || [],
          stats: {
            memberCount: data.trace.stats?.memberCount || 0,
            tradeAlertCount: data.trace.stats?.tradeAlertCount || 0,
            messageCount: data.trace.stats?.messageCount || 0,
            totalTrades: data.trace.stats?.totalTrades || 0,
            winRate: data.trace.stats?.winRate || 0,
            profitFactor: data.trace.stats?.profitFactor || 0,
            averageRR: data.trace.stats?.averageRR || 0,
            totalPnL: data.trace.stats?.totalPnL || 0,
            bestTrade: data.trace.stats?.bestTrade || 0,
            worstTrade: data.trace.stats?.worstTrade || 0,
            averageDuration: data.trace.stats?.averageDuration || '0'
          },
          performance: data.trace.performance || {
            daily: { trades: 0, pnl: 0, winRate: 0 },
            weekly: { trades: 0, pnl: 0, winRate: 0 },
            monthly: { trades: 0, pnl: 0, winRate: 0 }
          }
        }
        
        setTrace(trace)
        setIsMember(data.isMember || false)
      } catch (error) {
        console.error('Error fetching trace:', error)
        setTrace(null)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrace()
  }, [session, params.slug])

  const handleJoin = async (tierId?: string) => {
    if (!session) {
      router.push('/auth/signin')
      return
    }

    try {
      const response = await fetch(`/api/traces/${params.slug}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tierId })
      })

      const data = await response.json()
      
      if (data.success) {
        setIsMember(true)
        // Refresh the page to get updated data
        router.refresh()
      } else {
        console.error('Failed to join:', data.error)
      }
    } catch (error) {
      console.error('Error joining trace:', error)
    }
  }

  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </PageContainer>
    )
  }

  if (!trace) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Trace Not Found</h2>
            <p className="text-muted-foreground">The trace you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  const userRole: TraceRole = session?.user ? getUserTraceRole(session.user.id, trace) : 'none'

  // Show storefront for non-members
  if (!isMember) {
    return (
      <PageContainer>
        <TraceStorefront 
          trace={{
            name: trace.name,
            description: trace.description,
            features: trace.features,
            coverImage: trace.coverImage,
            avatar: trace.avatar,
            stats: {
              memberCount: trace.stats.memberCount,
              tradeAlertCount: trace.stats.tradeAlertCount,
              winRate: trace.stats.winRate,
              profitFactor: trace.stats.profitFactor
            },
            owner: {
              name: `${trace.createdBy.firstName} ${trace.createdBy.lastName}`,
              avatarUrl: trace.createdBy.avatarUrl
            }
          }}
          onJoin={handleJoin}
        />
      </PageContainer>
    )
  }

  // Show member content
  return (
    <PageContainer>
      <div className="space-y-6">
        {/* Header */}
        <div className="relative">
          {trace.coverImage && (
            <div 
              className="absolute inset-0 h-48 bg-cover bg-center rounded-lg"
              style={{ backgroundImage: `url(${trace.coverImage})` }}
            />
          )}
          <div className="relative z-10 pt-32 px-6">
            <div className="flex items-start gap-6">
              {trace.avatar && (
                <Avatar className="h-24 w-24 border-4 border-background">
                  <AvatarImage src={trace.avatar} />
                  <AvatarFallback>{trace.name[0]}</AvatarFallback>
                </Avatar>
              )}
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{trace.name}</h1>
                    <p className="text-muted-foreground mt-2">{trace.description}</p>
                    <div className="flex gap-2 mt-4">
                      {trace.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Show settings menu for all members */}
                    <UserSettings traceId={trace._id} userRole={userRole} />
                    {/* Show admin panel button and menu for owners and moderators */}
                    {(userRole === 'owner' || userRole === 'moderator') && (
                      <>
                        <AdminPanelButton slug={params.slug} />
                        <AdminMenu 
                          traceId={trace._id} 
                          userRole={userRole}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Members</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trace.stats.memberCount}</div>
              <p className="text-xs text-muted-foreground">Active traders and investors</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Trade Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trace.stats.tradeAlertCount}</div>
              <p className="text-xs text-muted-foreground">Shared trading opportunities</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{trace.stats.messageCount}</div>
              <p className="text-xs text-muted-foreground">Community discussions</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="chat" className="space-y-6">
          <TabsList>
            <TabsTrigger value="chat">Live Chat</TabsTrigger>
            <TabsTrigger value="positions">Open Positions</TabsTrigger>
            <TabsTrigger value="alerts">Trade Alerts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-4">
            <LiveChat traceId={trace._id} />
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <Suspense fallback={<div>Loading positions...</div>}>
              <OpenPositions 
                traceId={trace._id}
                initialPositions={trace.openPositions}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Suspense fallback={<div>Loading alerts...</div>}>
              <TradeAlerts 
                traceId={trace._id}
                initialAlerts={trace.recentAlerts}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Suspense fallback={<div>Loading analytics...</div>}>
              <TraceAnalytics 
                traceId={trace._id}
                initialStats={trace.stats}
                initialPerformance={trace.performance}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="members" className="space-y-4">
            <Members 
              members={trace.members} 
              moderators={trace.moderators}
              createdBy={trace.createdBy}
            />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 