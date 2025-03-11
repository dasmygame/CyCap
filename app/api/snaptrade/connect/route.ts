import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { SnapTradeService } from '@/lib/services/snapTrade'

interface BrokerConnection {
  brokerName: string
  accountName: string
  status: string
  authorizationId: string
  accountId: string
}

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

    const { broker, immediateRedirect, customRedirect } = await req.json()

    // Get connection URL
    const response = await SnapTradeService.client.authentication.loginSnapTradeUser({
      userId: user.snapTrade.userId,
      userSecret: user.snapTrade.userSecret,
      broker,
      immediateRedirect: immediateRedirect ?? false,
      customRedirect: customRedirect ?? `${process.env.NEXTAUTH_URL}/settings?tab=brokers`,
      connectionType: "read",
    })

    if (!response.data) {
      throw new Error('No response data from SnapTrade')
    }

    interface SnapTradeResponse {
      redirectURI: string
      sessionId: string
    }

    const data = response.data as SnapTradeResponse
    if (!data.redirectURI) {
      console.error('Response data:', data)
      throw new Error('No redirect URL in response')
    }

    // Get current connections from SnapTrade
    const connections = await SnapTradeService.listBrokerageConnections(
      user.snapTrade.userId,
      user.snapTrade.userSecret
    )

    // Map all connections to our format
    const formattedConnections: BrokerConnection[] = connections.map(conn => ({
      accountId: conn.id || '',
      authorizationId: conn.id || '',
      brokerName: (conn.brokerage?.name || conn.broker?.name || 'Unknown').toUpperCase(),
      accountName: conn.name || 'Unknown',
      status: conn.status || 'Unknown'
    }))

    // Update user with all current connections
    await User.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          'snapTrade.brokerConnections': formattedConnections
        }
      }
    )

    return NextResponse.json({ redirectUrl: data.redirectURI })
  } catch (error) {
    console.error('Error connecting broker:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 