import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { Trace } from '@/lib/models/Trace'
import { UserSettings } from '@/lib/models/UserSettings'
import { Types } from 'mongoose'

interface TraceDocument {
  _id: Types.ObjectId
  createdBy: {
    _id: Types.ObjectId
  }
}

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
      .populate('createdBy', '_id')
      .lean() as unknown as TraceDocument

    if (!trace) {
      return NextResponse.json(
        { error: 'Trace not found' },
        { status: 404 }
      )
    }

    // Convert IDs to strings for comparison
    const userId = session.user.id
    const createdById = trace.createdBy._id.toString()

    // Check if user is the owner
    if (createdById === userId) {
      return NextResponse.json(
        { error: 'Owners cannot leave their own trace' },
        { status: 403 }
      )
    }

    // Convert user ID to ObjectId for MongoDB operations
    const userObjectId = new Types.ObjectId(userId)

    // Remove user from members and moderators
    const updateResult = await Trace.updateOne(
      { _id: trace._id },
      {
        $pull: {
          members: userObjectId,
          moderators: userObjectId
        }
      }
    )

    if (!updateResult.modifiedCount) {
      return NextResponse.json(
        { error: 'User is not a member of this trace' },
        { status: 400 }
      )
    }

    // Delete user settings for this trace
    await UserSettings.deleteOne({
      userId: userObjectId,
      traceId: trace._id
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error leaving trace:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 