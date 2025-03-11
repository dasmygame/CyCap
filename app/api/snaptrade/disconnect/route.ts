import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { SnapTradeService } from '@/lib/services/snapTrade'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user || !user.snapTrade?.userId || !user.snapTrade?.userSecret) {
      return new NextResponse('User not registered with SnapTrade', { status: 400 })
    }

    const { authorizationId } = await req.json()
    if (!authorizationId) {
      return new NextResponse('Authorization ID is required', { status: 400 })
    }

    // Remove the brokerage authorization from SnapTrade
    await SnapTradeService.client.connections.removeBrokerageAuthorization({
      userId: user.snapTrade.userId,
      userSecret: user.snapTrade.userSecret,
      authorizationId,
    })

    // Remove the connection from the user's document
    await User.updateOne(
      { email: session.user.email },
      { 
        $pull: { 
          'snapTrade.brokerConnections': { authorizationId }
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting broker:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 