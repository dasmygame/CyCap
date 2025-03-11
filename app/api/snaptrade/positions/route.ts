import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { SnapTradeService } from '@/lib/services/snapTrade'

interface SnapTradeSymbol {
  symbol: {
    id: string
    symbol: string
    description: string
    currency: {
      code: string
      name: string
      id: string
    }
    type: {
      code: string
      description: string
    }
  }
}

interface SnapTradePosition {
  symbol: SnapTradeSymbol
  units: number
  price: number
  market_value?: number
  average_purchase_price?: number
  open_pnl?: number
  currency: {
    code: string
  }
}

interface SnapTradeAccount {
  positions?: SnapTradePosition[]
  total_value?: {
    value: number
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.email) {
      return new NextResponse('Unauthorized', { status: 401 })
    }

    await connectDB()

    const user = await User.findOne({ email: session.user.email })
    if (!user?.snapTrade?.userId || !user?.snapTrade?.userSecret) {
      return new NextResponse('User not registered with SnapTrade', { status: 400 })
    }

    const holdings = await SnapTradeService.getUserHoldings(
      user.snapTrade.userId,
      user.snapTrade.userSecret
    ) as SnapTradeAccount[]

    if (!holdings?.length) {
      return NextResponse.json({
        positions: [],
        stockDayChange: 0,
        cryptoDayChange: 0,
        totals: { stock: 0, crypto: 0, total: 0 }
      })
    }

    const positions = holdings.flatMap(account => {
      return (account.positions || []).map(position => {
        const marketValue = position.market_value || (position.units * position.price) || 0
        const symbolObj = position.symbol?.symbol || position.symbol
        const symbol = typeof symbolObj === 'object' ? symbolObj.symbol : symbolObj
        const securityType = symbolObj?.type?.code === 'crypto' ? 'CRYPTO' : 'EQUITY'

        return {
          symbol,
          quantity: position.units || 0,
          marketValue,
          averageCost: position.average_purchase_price || 0,
          unrealizedPL: position.open_pnl || 0,
          unrealizedPLPercent: position.average_purchase_price 
            ? ((marketValue - (position.average_purchase_price * position.units)) / (position.average_purchase_price * position.units)) * 100 
            : 0,
          lastPrice: position.price || 0,
          currency: position.currency?.code || 'USD',
          securityType,
        }
      })
    })

    const stockPositions = positions.filter(p => p.securityType !== 'CRYPTO')
    const cryptoPositions = positions.filter(p => p.securityType === 'CRYPTO')

    const stockTotal = stockPositions.reduce((sum, p) => sum + p.marketValue, 0)
    const cryptoTotal = cryptoPositions.reduce((sum, p) => sum + p.marketValue, 0)

    return NextResponse.json({
      positions,
      stockDayChange: stockTotal * 0.01,
      cryptoDayChange: cryptoTotal * 0.02,
      totals: {
        stock: stockTotal,
        crypto: cryptoTotal,
        total: stockTotal + cryptoTotal
      }
    })
  } catch (error) {
    console.error('Error fetching positions:', error)
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 