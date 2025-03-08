import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { Types } from 'mongoose'

interface TraceDocument {
  _id: Types.ObjectId
  name: string
  slug: string
  avatar?: string
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Find all traces where the user is a member, moderator, or owner
    const traces = await Trace.find({
      $or: [
        { members: session.user.id },
        { moderators: session.user.id },
        { createdBy: session.user.id }
      ]
    })
    .select('name slug avatar')
    .sort({ updatedAt: -1 })
    .lean() as unknown as TraceDocument[]

    return NextResponse.json({
      traces: traces.map(trace => ({
        _id: trace._id.toString(),
        name: trace.name,
        slug: trace.slug,
        avatar: trace.avatar
      }))
    })
  } catch (error) {
    console.error('Error fetching joined traces:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 