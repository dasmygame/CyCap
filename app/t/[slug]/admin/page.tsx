import { notFound, redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { GeneralSettings } from './_components/general-settings'
import { MembershipTiers } from './_components/membership-tiers'
import { PayoutSettings } from './_components/payout-settings'
import { Analytics } from './_components/analytics'
import { Moderation } from './_components/moderation'
import { Types } from 'mongoose'

interface AdminPageProps {
  params: {
    slug: string
  }
}

interface User {
  id: string
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
}

interface BannedUser {
  id: string
  name: string
  email: string
  reason: string
  bannedAt: string
  bannedBy: string
  expiresAt?: string
}

interface MemberUser {
  _id: Types.ObjectId
  name: string
  email: string
  role: string
  joinedAt: string
  lastActive: string
}

interface CreatedByUser {
  _id: Types.ObjectId
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

interface PopulatedTrace {
  _id: Types.ObjectId
  name: string
  description?: string
  avatar?: string
  coverImage?: string
  tags: string[]
  createdBy: CreatedByUser
  members: MemberUser[]
  moderators: MemberUser[]
}

interface TraceWithAnalytics {
  _id: string
  name: string
  description?: string
  avatar?: string
  coverImage?: string
  tags: string[]
  createdBy: {
    id: string
    name: string
    email: string
  } | null
  members: User[]
  moderators: User[]
  bannedUsers: BannedUser[]
  analytics: {
    dailyVisits: Array<{
      date: string
      count: number
    }>
    membershipStats: {
      totalMembers: number
      activeSubscriptions: number
      churnRate: number
      mrr: number
    }
    engagementMetrics: {
      averageTimeSpent: number
      bounceRate: number
      pageViews: number
    }
    revenueData: Array<{
      date: string
      amount: number
    }>
  }
}

async function getTraceData(slug: string): Promise<TraceWithAnalytics | null> {
  await connectDB()
  const trace = await Trace.findOne({ slug })
    .populate('createdBy', 'firstName lastName username avatarUrl')
    .populate('members moderators', 'name email role joinedAt lastActive')
    .lean()

  if (!trace) return null

  // Type assertion after validation
  const typedTrace = trace as unknown as PopulatedTrace

  // Ensure createdBy exists and has required fields
  if (!typedTrace.createdBy || !typedTrace.createdBy._id) {
    return null
  }

  // Serialize MongoDB objects and ensure proper typing
  const serializedTrace: TraceWithAnalytics = {
    _id: typedTrace._id.toString(),
    name: typedTrace.name,
    description: typedTrace.description,
    avatar: typedTrace.avatar,
    coverImage: typedTrace.coverImage,
    tags: typedTrace.tags || [],
    members: (typedTrace.members || []).map(member => ({
      id: member._id.toString(),
      name: member.name,
      email: member.email,
      role: member.role,
      joinedAt: member.joinedAt || new Date().toISOString(),
      lastActive: member.lastActive || new Date().toISOString()
    })),
    moderators: (typedTrace.moderators || []).map(mod => ({
      id: mod._id.toString(),
      name: mod.name,
      email: mod.email,
      role: 'moderator',
      joinedAt: mod.joinedAt || new Date().toISOString(),
      lastActive: mod.lastActive || new Date().toISOString()
    })),
    createdBy: {
      id: typedTrace.createdBy._id.toString(),
      name: `${typedTrace.createdBy.firstName} ${typedTrace.createdBy.lastName}`,
      email: typedTrace.createdBy.username
    },
    bannedUsers: [],
    analytics: {
      dailyVisits: [],
      membershipStats: {
        totalMembers: typedTrace.members?.length || 0,
        activeSubscriptions: typedTrace.members?.length || 0,
        churnRate: 0,
        mrr: 0,
      },
      engagementMetrics: {
        averageTimeSpent: 0,
        bounceRate: 0,
        pageViews: 0,
      },
      revenueData: [],
    }
  }

  return serializedTrace
}

export default async function AdminPage({ params }: AdminPageProps) {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/auth/signin')

  const trace = await getTraceData(params.slug)
  if (!trace) notFound()

  // Check role using serialized data
  const isOwner = trace.createdBy?.id === session.user.id
  const isModerator = trace.moderators.some(mod => mod.id === session.user.id)
  
  if (!isOwner && !isModerator) {
    redirect(`/t/${params.slug}`)
  }

  const userRole = isOwner ? 'owner' : 'moderator'

  return (
    <div className="container py-20 space-y-6">
      <h1 className="text-4xl font-bold tracking-tight">Admin Panel</h1>
      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="bg-background">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="membership">Membership</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="moderation">Moderation</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <GeneralSettings trace={trace} userRole={userRole} />
        </TabsContent>

        <TabsContent value="membership" className="space-y-6">
          <MembershipTiers trace={trace} userRole={userRole} />
        </TabsContent>

        <TabsContent value="payouts" className="space-y-6">
          <PayoutSettings trace={trace} userRole={userRole} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <Analytics trace={trace} userRole={userRole} />
        </TabsContent>

        <TabsContent value="moderation" className="space-y-6">
          <Moderation trace={trace} userRole={userRole} />
        </TabsContent>
      </Tabs>
    </div>
  )
} 