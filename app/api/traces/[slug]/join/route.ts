import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'

export async function POST(
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

    // Check if user is already a member
    if (trace.members.includes(session.user.id)) {
      return NextResponse.json(
        { error: 'Already a member' },
        { status: 400 }
      )
    }

    // Add user to members
    trace.members.push(session.user.id)
    await trace.save()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error joining trace:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 