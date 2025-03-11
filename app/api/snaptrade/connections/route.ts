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

    const user = await User.findOne({ email: session.user.email })
    if (!user || !user.snapTrade?.userId || !user.snapTrade?.userSecret) {
      return new NextResponse('User not registered with SnapTrade', { status: 400 })
    }

    // Return the stored connections from the database
    return NextResponse.json({ 
      connections: user.snapTrade.brokerConnections || [] 
    })
  } catch (error) {
    console.error('Error fetching brokerage connections:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 