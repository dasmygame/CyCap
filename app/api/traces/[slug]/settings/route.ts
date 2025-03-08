import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { UserSettings } from '@/lib/models/UserSettings'

export async function PUT(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    await connectDB()

    // Find the trace
    const trace = await Trace.findOne({ slug: params.slug })
    if (!trace) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      )
    }

    // Check if user is a member
    const isMember = trace.members.includes(session.user.id) ||
      trace.moderators.includes(session.user.id) ||
      trace.createdBy.toString() === session.user.id

    if (!isMember) {
      return NextResponse.json(
        { error: 'Not a member of this trace' },
        { status: 403 }
      )
    }

    const { setting, value } = await request.json()

    // Validate setting and value
    const validSettings = ['tradeAlerts', 'chatMentions', 'priceAlerts', 'dailyUpdates']
    if (!validSettings.includes(setting)) {
      return NextResponse.json(
        { error: 'Invalid setting' },
        { status: 400 }
      )
    }

    if (typeof value !== 'boolean') {
      return NextResponse.json(
        { error: 'Invalid value' },
        { status: 400 }
      )
    }

    // Update or create user settings
    await UserSettings.findOneAndUpdate(
      {
        userId: session.user.id,
        traceId: trace._id
      },
      {
        $set: { [setting]: value }
      },
      {
        upsert: true,
        new: true
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating settings:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 