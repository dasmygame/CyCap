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
    const { twitter, linkedin, tradingview } = body

    await connectDB()

    const user = await User.findOneAndUpdate(
      { email: session.user.email },
      {
        $set: {
          'social.twitter': twitter || null,
          'social.linkedin': linkedin || null,
          'social.tradingview': tradingview || null,
        },
      },
      { new: true }
    )

    if (!user) {
      return new NextResponse('User not found', { status: 404 })
    }

    return NextResponse.json({
      social: {
        twitter: user.social?.twitter || null,
        linkedin: user.social?.linkedin || null,
        tradingview: user.social?.tradingview || null,
      },
    })
  } catch (error) {
    console.error('Error updating social links:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
} 