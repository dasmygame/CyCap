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

export async function GET() {
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

    // Get current connections from SnapTrade
    const connections = await SnapTradeService.listBrokerageConnections(
      user.snapTrade.userId,
      user.snapTrade.userSecret
    )

    // Map all connections to our format
    const formattedConnections: BrokerConnection[] = connections.map(conn => {
      const brokerName = (conn.brokerage?.name || conn.broker?.name || 'Unknown').toUpperCase()
      const accountId = conn.brokerage_authorization?.id || conn.id || ''
      const authorizationId = conn.id || ''
      
      return {
        accountId,
        authorizationId,
        brokerName,
        accountName: conn.name || 'Unknown',
        status: conn.status || 'Unknown'
      }
    })

    // Update user with all current connections using $set
    await User.updateOne(
      { email: session.user.email },
      { 
        $set: { 
          'snapTrade.brokerConnections': formattedConnections
        }
      }
    )

    return NextResponse.json({ connections: formattedConnections })
  } catch (error) {
    console.error('Error fetching connections:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 