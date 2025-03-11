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

    const { brokerName } = await req.json()
    if (!brokerName) {
      return new NextResponse('Broker name is required', { status: 400 })
    }

    // Get current connections from SnapTrade
    console.log('Fetching current connections from SnapTrade...')
    const connections = await SnapTradeService.client.connections.listBrokerageAuthorizations({
      userId: user.snapTrade.userId,
      userSecret: user.snapTrade.userSecret,
    })

    console.log('Raw connections from SnapTrade:', JSON.stringify(connections.data, null, 2))

    // Find the matching connection
    const connection = connections.data?.find(conn => 
      (conn.brokerage?.name || conn.broker?.name || '').toUpperCase() === brokerName
    )

    if (!connection || !connection.id) {
      console.log(`No connection found for broker: ${brokerName}`)
      return new NextResponse('Could not find connection for broker', { status: 400 })
    }

    console.log(`Found connection for ${brokerName}, authorization ID: ${connection.id}`)

    // Remove the brokerage authorization from SnapTrade
    await SnapTradeService.client.connections.removeBrokerageAuthorization({
      userId: user.snapTrade.userId,
      userSecret: user.snapTrade.userSecret,
      authorizationId: connection.id,
    })

    // Remove the connection from the user's document
    await User.updateOne(
      { email: session.user.email },
      { 
        $pull: { 
          'snapTrade.brokerConnections': { brokerName }
        }
      }
    )

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error disconnecting broker:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 