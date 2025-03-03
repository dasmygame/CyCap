import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    const body = await req.json()
    const { emailNotifications, tradeAlerts, communityUpdates, marketNews } = body

    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'notifications.emailNotifications': emailNotifications,
          'notifications.tradeAlerts': tradeAlerts,
          'notifications.communityUpdates': communityUpdates,
          'notifications.marketNews': marketNews,
        },
      },
      { new: true }
    )

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      notifications: {
        emailNotifications: user.notifications.emailNotifications,
        tradeAlerts: user.notifications.tradeAlerts,
        communityUpdates: user.notifications.communityUpdates,
        marketNews: user.notifications.marketNews,
      },
    })
  } catch (error) {
    console.error('Error updating notification settings:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 