import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { getUserTraceRole } from '@/lib/utils/permissions'

export async function POST(
  req: Request,
  { params }: { params: { traceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const trace = await Trace.findById(params.traceId)
    if (!trace) {
      return new NextResponse('Trace not found', { status: 404 })
    }

    // Check if user is already a member
    if (trace.members.includes(session.user.id)) {
      return new NextResponse('Already a member', { status: 400 })
    }

    // Add user to members
    trace.members.push(session.user.id)
    await trace.save()

    return NextResponse.json({ message: 'Joined successfully' })
  } catch (error) {
    console.error('Error joining trace:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { traceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const trace = await Trace.findById(params.traceId)
    if (!trace) {
      return new NextResponse('Trace not found', { status: 404 })
    }

    const userRole = getUserTraceRole(session.user.id, trace)
    
    // Owner cannot leave their own trace
    if (userRole === 'owner') {
      return new NextResponse('Owner cannot leave trace', { status: 400 })
    }

    // Remove user from members and moderators
    trace.members = trace.members.filter(id => id.toString() !== session.user.id)
    trace.moderators = trace.moderators.filter(id => id.toString() !== session.user.id)
    await trace.save()

    return NextResponse.json({ message: 'Left successfully' })
  } catch (error) {
    console.error('Error leaving trace:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 