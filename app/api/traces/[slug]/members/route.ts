import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { getUserTraceRole } from '@/lib/utils/permissions'
import { Types } from 'mongoose'

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const trace = await Trace.findOne({ slug: params.slug })
      .populate('members', 'firstName lastName username avatarUrl')
      .populate('moderators', 'firstName lastName username avatarUrl')
      .populate('createdBy', 'firstName lastName username avatarUrl')

    if (!trace) {
      return new NextResponse('Trace not found', { status: 404 })
    }

    const userRole = getUserTraceRole(session.user.id, trace)
    if (userRole === 'none') {
      return new NextResponse('Not a member', { status: 403 })
    }

    return NextResponse.json({
      members: trace.members,
      moderators: trace.moderators,
      createdBy: trace.createdBy
    })
  } catch (error) {
    console.error('Error fetching members:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function POST(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { userId, action } = await req.json()
    if (!userId || !action) {
      return new NextResponse('User ID and action are required', { status: 400 })
    }

    await connectDB()

    const trace = await Trace.findOne({ slug: params.slug })
    if (!trace) {
      return new NextResponse('Trace not found', { status: 404 })
    }

    const userRole = getUserTraceRole(session.user.id, trace)
    if (userRole !== 'owner' && userRole !== 'moderator') {
      return new NextResponse('Insufficient permissions', { status: 403 })
    }

    switch (action) {
      case 'remove':
        // Remove user from members and moderators
        trace.members = trace.members.filter((id: Types.ObjectId | string) => id.toString() !== userId)
        trace.moderators = trace.moderators.filter((id: Types.ObjectId | string) => id.toString() !== userId)
        break
      case 'promote':
        // Add user to moderators if they're a member
        if (trace.members.some((id: Types.ObjectId | string) => id.toString() === userId)) {
          if (!trace.moderators.some((id: Types.ObjectId | string) => id.toString() === userId)) {
            trace.moderators.push(userId)
          }
        } else {
          return new NextResponse('User must be a member first', { status: 400 })
        }
        break
      case 'demote':
        // Remove user from moderators
        trace.moderators = trace.moderators.filter((id: Types.ObjectId | string) => id.toString() !== userId)
        break
      default:
        return new NextResponse('Invalid action', { status: 400 })
    }

    await trace.save()

    return NextResponse.json({ message: 'Member updated successfully' })
  } catch (error) {
    console.error('Error updating member:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 