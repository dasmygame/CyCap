import { notFound } from 'next/navigation'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { PageContainer } from '@/components/page-container'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { LiveChat } from './_components/live-chat'
import { OpenPositions } from './_components/open-positions'
import { TraceAnalytics } from './_components/analytics'
import { TradeAlerts } from './_components/trade-alerts'
import { Members } from './_components/members'

async function getTrace(slug: string) {
  await connectDB()
  const trace = await Trace.findOne({ slug })
    .populate('createdBy', 'firstName lastName username avatarUrl')
    .populate('members', 'firstName lastName username avatarUrl')
    .populate('moderators', 'firstName lastName username avatarUrl')
    .lean()
  
  if (!trace) {
    return null
  }

  // Serialize MongoDB objects
  return JSON.parse(JSON.stringify(trace))
}

export default async function TracePage({ params }: { params: { slug: string } }) {
  const trace = await getTrace(params.slug)

  if (!trace) {
    notFound()
  }

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
                <h1 className="text-3xl font-bold">{trace.name}</h1>
                <p className="text-muted-foreground mt-2">{trace.description}</p>
                <div className="flex gap-2 mt-4">
                  {trace.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <Button>Join Trace</Button>
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
            <OpenPositions traceId={trace._id.toString()} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <TradeAlerts traceId={trace._id.toString()} />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <TraceAnalytics traceId={trace._id.toString()} />
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