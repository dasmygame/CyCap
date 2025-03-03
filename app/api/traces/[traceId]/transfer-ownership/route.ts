import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { getUserTraceRole } from '@/lib/utils/permissions'
import { Types } from 'mongoose'

export async function POST(
  req: Request,
  { params }: { params: { traceId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const { newOwnerId } = await req.json()
    if (!newOwnerId) {
      return new NextResponse('New owner ID is required', { status: 400 })
    }

    await connectDB()

    const trace = await Trace.findById(params.traceId)
    if (!trace) {
      return new NextResponse('Trace not found', { status: 404 })
    }

    const userRole = getUserTraceRole(session.user.id, trace)
    if (userRole !== 'owner') {
      return new NextResponse('Only the owner can transfer ownership', { status: 403 })
    }

    // Check if new owner is a member
    if (!trace.members.some((id: Types.ObjectId | string) => id.toString() === newOwnerId)) {
      return new NextResponse('New owner must be a member of the trace', { status: 400 })
    }

    // Transfer ownership
    const oldOwnerId = trace.createdBy
    trace.createdBy = newOwnerId

    // Add old owner to moderators if not already there
    if (!trace.moderators.some((id: Types.ObjectId | string) => id.toString() === oldOwnerId.toString())) {
      trace.moderators.push(oldOwnerId)
    }

    await trace.save()

    return NextResponse.json({ message: 'Ownership transferred successfully' })
  } catch (error) {
    console.error('Error transferring ownership:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 