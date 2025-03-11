import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email }).select('-password')
    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      profile: {
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        bio: user.bio || '',
        avatarUrl: user.avatarUrl || user.image || '',
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        occupation: user.occupation || '',
      },
      social: {
        twitter: user.social?.twitter || {
          username: '',
          profileUrl: '',
          verified: false
        },
        linkedin: user.social?.linkedin || {
          username: '',
          profileUrl: '',
          verified: false
        },
        tradingview: user.social?.tradingview || {
          username: '',
          profileUrl: '',
          verified: false
        },
      },
      notifications: {
        emailNotifications: user.notifications?.emailNotifications ?? true,
        tradeAlerts: user.notifications?.tradeAlerts ?? true,
        communityUpdates: user.notifications?.communityUpdates ?? true,
        marketNews: user.notifications?.marketNews ?? false,
      },
      snapTrade: {
        userId: user.snapTrade?.userId || '',
        userSecret: user.snapTrade?.userSecret || '',
        registeredAt: user.snapTrade?.registeredAt || null,
        brokerConnections: user.snapTrade?.brokerConnections || []
      }
    })
  } catch (error) {
    console.error('Error fetching settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 