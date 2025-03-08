import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { ITrace } from '@/lib/models/types'
import { TraceStats } from '@/lib/models/types'
import { ITracePosition, ITraceAlert } from '@/lib/models/types'
import { PerformanceMetrics } from '@/lib/models/types'
import { Types } from 'mongoose'

interface PopulatedMember {
  _id: string
  firstName: string
  lastName: string
  username: string
  avatarUrl?: string
}

interface MongooseTrace {
  _id: Types.ObjectId
  slug: string
  name: string
  description: string
  price: number
  features: string[]
  coverImage?: string
  avatar?: string
  tags: string[]
  members: Array<{
    _id: Types.ObjectId
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }>
  moderators: Array<{
    _id: Types.ObjectId
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }>
  createdBy: {
    _id: Types.ObjectId
    firstName: string
    lastName: string
    username: string
    avatarUrl?: string
  }
  stats?: TraceStats
  alerts?: ITraceAlert[]
  positions?: ITracePosition[]
  messages?: { _id: Types.ObjectId }[]
  performance?: PerformanceMetrics
  createdAt: Date
  updatedAt: Date
}

interface ExtendedTrace extends Omit<ITrace, 'members' | 'moderators' | 'createdBy'> {
  members: PopulatedMember[]
  moderators: PopulatedMember[]
  createdBy: PopulatedMember
  stats?: TraceStats
  alerts?: ITraceAlert[]
  positions?: ITracePosition[]
  messages?: { _id: Types.ObjectId }[]
  performance?: PerformanceMetrics
}

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const session = await getServerSession(authOptions)

    const rawTrace = await Trace.findOne({ slug: params.slug })
      .populate('createdBy', 'firstName lastName username avatarUrl')
      .populate('members', 'firstName lastName username avatarUrl')
      .populate('moderators', 'firstName lastName username avatarUrl')
      .lean() as unknown as MongooseTrace

    if (!rawTrace) {
      return NextResponse.json({ error: 'Trace not found' }, { status: 404 })
    }

    // Cast the raw trace to our ExtendedTrace type
    const trace: ExtendedTrace = {
      _id: rawTrace._id.toString(),
      slug: rawTrace.slug,
      name: rawTrace.name,
      description: rawTrace.description,
      price: rawTrace.price,
      features: rawTrace.features || [],
      coverImage: rawTrace.coverImage,
      avatar: rawTrace.avatar,
      tags: rawTrace.tags || [],
      members: (rawTrace.members || []).map(m => ({
        ...m,
        _id: m._id.toString()
      })),
      moderators: (rawTrace.moderators || []).map(m => ({
        ...m,
        _id: m._id.toString()
      })),
      createdBy: {
        ...rawTrace.createdBy,
        _id: rawTrace.createdBy._id.toString()
      },
      stats: rawTrace.stats,
      alerts: rawTrace.alerts,
      positions: rawTrace.positions,
      messages: rawTrace.messages,
      performance: rawTrace.performance,
      createdAt: rawTrace.createdAt || new Date(),
      updatedAt: rawTrace.updatedAt || new Date()
    }

    // Check if user is a member
    const isMember = session?.user ? (
      trace.members.some(member => member._id === session.user.id) || 
      trace.moderators.some(mod => mod._id === session.user.id) ||
      trace.createdBy._id === session.user.id
    ) : false

    return NextResponse.json({
      isMember,
      trace: {
        _id: trace._id,
        slug: trace.slug,
        name: trace.name,
        description: trace.description,
        price: trace.price,
        features: trace.features,
        coverImage: trace.coverImage,
        avatar: trace.avatar,
        tags: trace.tags,
        createdBy: trace.createdBy,
        moderators: trace.moderators,
        members: trace.members,
        stats: {
          memberCount: trace.members.length,
          tradeAlertCount: trace.alerts?.length || 0,
          messageCount: trace.messages?.length || 0,
          totalTrades: trace.stats?.totalTrades || 0,
          winRate: trace.stats?.winRate || 0,
          profitFactor: trace.stats?.profitFactor || 0,
          averageRR: trace.stats?.averageRR || 0,
          totalPnL: trace.stats?.totalPnL || 0,
          bestTrade: trace.stats?.bestTrade || 0,
          worstTrade: trace.stats?.worstTrade || 0,
          averageDuration: trace.stats?.averageDuration || '0'
        },
        openPositions: trace.positions || [],
        recentAlerts: trace.alerts?.slice(0, 10) || [],
        performance: trace.performance || {
          daily: { trades: 0, pnl: 0, winRate: 0 },
          weekly: { trades: 0, pnl: 0, winRate: 0 },
          monthly: { trades: 0, pnl: 0, winRate: 0 }
        }
      }
    })
  } catch (error) {
    console.error('Error in membership check:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 