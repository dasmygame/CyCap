import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { Trace, ITrace } from '@/lib/models/Trace'
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
import { Suspense } from 'react'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import TracePosition from '@/lib/models/TracePosition'
import TraceAlert from '@/lib/models/TraceAlert'
import { getUserTraceRole } from '@/lib/utils/permissions'
import { AdminMenu } from './_components/admin-menu'
import { JoinButton } from './_components/join-button'
import { AdminPanelButton } from './_components/admin-panel-button'

async function getTraceData(slug: string) {
  await connectDB()
  
  // Get trace data with populated references
  const trace = await Trace.findOne({ slug })
    .populate('createdBy', 'firstName lastName username avatarUrl')
    .populate('members', 'firstName lastName username avatarUrl')
    .populate('moderators', 'firstName lastName username avatarUrl')
    .lean()

  if (!trace) return null

  // Cast the trace to the correct type after lean query
  const typedTrace = trace as unknown as ITrace & { _id: string }

  // Fetch positions, alerts, and calculate stats
  const [openPositions, recentAlerts, stats, performance] = await Promise.all([
    TracePosition.find({ traceId: typedTrace._id, status: 'open' })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    TraceAlert.find({ traceId: typedTrace._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean(),
    calculateTraceStats(typedTrace._id),
    calculatePerformanceMetrics(typedTrace._id)
  ])

  // Serialize MongoDB objects and add computed stats
  return {
    ...JSON.parse(JSON.stringify(typedTrace)),
    openPositions,
    recentAlerts,
    stats: {
      ...stats,
      memberCount: typedTrace.members.length,
      tradeAlertCount: await TraceAlert.countDocuments({ traceId: typedTrace._id }),
      messageCount: 0 // TODO: Implement message count
    },
    performance
  }
}

// Helper function to calculate trace statistics
async function calculateTraceStats(traceId: string) {
  const positions = await TracePosition.find({ traceId })
  
  const stats = {
    totalTrades: positions.length,
    winRate: 0,
    profitFactor: 0,
    averageRR: 0,
    totalPnL: 0,
    bestTrade: 0,
    worstTrade: 0,
    averageDuration: '0h 0m'
  }

  if (positions.length > 0) {
    const winners = positions.filter(p => p.pnl > 0)
    const losers = positions.filter(p => p.pnl < 0)
    
    stats.winRate = (winners.length / positions.length) * 100
    stats.totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0)
    stats.bestTrade = Math.max(...positions.map(p => p.pnl))
    stats.worstTrade = Math.min(...positions.map(p => p.pnl))
    
    const totalWins = winners.reduce((sum, p) => sum + p.pnl, 0)
    const totalLosses = Math.abs(losers.reduce((sum, p) => sum + p.pnl, 0))
    stats.profitFactor = totalLosses > 0 ? totalWins / totalLosses : totalWins

    const totalR = positions.reduce((sum, p) => sum + (p.performance.r || 0), 0)
    stats.averageRR = totalR / positions.length

    const avgDurationMs = positions.reduce((sum, p) => sum + (p.performance.duration || 0), 0) / positions.length
    const hours = Math.floor(avgDurationMs / (1000 * 60 * 60))
    const minutes = Math.floor((avgDurationMs % (1000 * 60 * 60)) / (1000 * 60))
    stats.averageDuration = `${hours}h ${minutes}m`
  }

  return stats
}

// Helper function to calculate performance metrics
async function calculatePerformanceMetrics(traceId: string) {
  const now = new Date()
  const dayStart = new Date(now.setHours(0,0,0,0))
  const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
  const monthStart = new Date(now.setDate(1))

  const [dailyPositions, weeklyPositions, monthlyPositions] = await Promise.all([
    TracePosition.find({ traceId, createdAt: { $gte: dayStart } }),
    TracePosition.find({ traceId, createdAt: { $gte: weekStart } }),
    TracePosition.find({ traceId, createdAt: { $gte: monthStart } })
  ])

  return {
    daily: {
      trades: dailyPositions.length,
      pnl: dailyPositions.reduce((sum, p) => sum + p.pnl, 0),
      winRate: dailyPositions.length > 0 ? 
        (dailyPositions.filter(p => p.pnl > 0).length / dailyPositions.length) * 100 : 0
    },
    weekly: {
      trades: weeklyPositions.length,
      pnl: weeklyPositions.reduce((sum, p) => sum + p.pnl, 0),
      winRate: weeklyPositions.length > 0 ?
        (weeklyPositions.filter(p => p.pnl > 0).length / weeklyPositions.length) * 100 : 0
    },
    monthly: {
      trades: monthlyPositions.length,
      pnl: monthlyPositions.reduce((sum, p) => sum + p.pnl, 0),
      winRate: monthlyPositions.length > 0 ?
        (monthlyPositions.filter(p => p.pnl > 0).length / monthlyPositions.length) * 100 : 0
    }
  }
}

export default async function TracePage({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions)
  const trace = await getTraceData(params.slug)

  if (!trace || !session) {
    notFound()
  }

  // console.log('Debug - Session user:', { //verbose output to see what is in the session
  //   id: session.user.id,
  //   name: session.user.name
  // })
  
  // console.log('Debug - Trace data:', {
  //   createdBy: trace.createdBy,
  //   moderators: trace.moderators,
  //   members: trace.members
  // })

  const userRole = getUserTraceRole(session.user.id, trace)
  // console.log('Debug - User role:', userRole)

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
                    {/* Show join/leave button based on actual membership status */}
                    <JoinButton 
                      traceId={trace._id.toString()} 
                      isMember={userRole !== 'none'}
                      userRole={userRole}
                    />
                    
                    {/* Show admin panel button and menu for owners and moderators */}
                    {(userRole === 'owner' || userRole === 'moderator') && (
                      <>
                        <AdminPanelButton slug={params.slug} />
                        <AdminMenu 
                          traceId={trace._id.toString()} 
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
            <LiveChat traceId={trace._id.toString()} />
          </TabsContent>

          <TabsContent value="positions" className="space-y-4">
            <Suspense fallback={<div>Loading positions...</div>}>
              <OpenPositions 
                traceId={trace._id.toString()}
                initialPositions={trace.openPositions}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Suspense fallback={<div>Loading alerts...</div>}>
              <TradeAlerts 
                traceId={trace._id.toString()}
                initialAlerts={trace.recentAlerts}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Suspense fallback={<div>Loading analytics...</div>}>
              <TraceAnalytics 
                traceId={trace._id.toString()}
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