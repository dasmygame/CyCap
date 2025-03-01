import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import connectDB from '@/lib/mongodb'
import Position from '@/lib/models/Position'
import Community from '@/lib/models/Community'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session) {
    return new NextResponse(
      JSON.stringify({ message: 'Unauthorized' }),
      { status: 401 }
    )
  }

  // Connect to database
  await connectDB()

  // Fetch user's positions
  const positions = await Position.find({ userId: session.user.id })
    .sort({ createdAt: -1 })

  // Calculate portfolio stats
  const portfolioStats = positions.reduce((acc, position) => {
    const currentValue = position.shares * position.currentPrice
    acc.totalValue += currentValue
    acc.totalProfitLoss += position.profitLoss
    return acc
  }, { totalValue: 0, totalProfitLoss: 0 })

  // Calculate portfolio percentage change
  const portfolioPercentageChange = portfolioStats.totalValue > 0
    ? (portfolioStats.totalProfitLoss / (portfolioStats.totalValue - portfolioStats.totalProfitLoss)) * 100
    : 0

  // Fetch user's communities
  const communities = await Community.find({
    members: session.user.id
  })
  .select('name description avatar members')
  .limit(5)

  return NextResponse.json({
    positions,
    communities,
    portfolioStats: {
      ...portfolioStats,
      percentageChange: portfolioPercentageChange
    }
  })
} 