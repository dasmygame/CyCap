import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { User } from '@/lib/models/User'
import { SnapTradeService } from '@/lib/services/snapTrade'
import connectDB from '@/lib/mongodb'

export async function POST() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Connect to database
    await connectDB()

    // Get user from database
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Check if user is already registered with SnapTrade
    if (user.snapTrade?.userId) {
      return NextResponse.json({ error: 'User already registered with SnapTrade' }, { status: 400 })
    }

    // Register user with SnapTrade
    const snapTradeUser = await SnapTradeService.registerUser(user._id.toString())

    // Update user with SnapTrade credentials
    user.snapTrade = {
      userId: snapTradeUser.userId,
      userSecret: snapTradeUser.userSecret,
      registeredAt: new Date(),
      brokerConnections: []
    }
    await user.save()

    return NextResponse.json({
      message: 'Successfully registered with SnapTrade',
      snapTradeUserId: snapTradeUser.userId
    })
  } catch (error) {
    console.error('Error registering with SnapTrade:', error)
    return NextResponse.json(
      { error: 'Failed to register with SnapTrade' },
      { status: 500 }
    )
  }
} 