import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { connectDB } from '@/lib/db'
import { User } from '@/lib/models/User'
import { SnapTradeService } from '@/lib/services/snapTrade'
import { Position } from 'snaptrade-typescript-sdk'

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

    const accountsResponse = await SnapTradeService.client.accountInformation.listUserAccounts({
      userId: user.snapTrade.userId,
      userSecret: user.snapTrade.userSecret
    })
    
    const accounts = accountsResponse.data || []
    const allPositions: Position[] = []

    for (const account of accounts) {
      try {
        // Get account balances for Webull
        if (account.institution_name === 'Webull') {
          const balanceResponse = await SnapTradeService.client.accountInformation.getUserAccountBalance({
            userId: user.snapTrade.userId,
            userSecret: user.snapTrade.userSecret,
            accountId: account.id
          })
          console.log('Webull account balances:', JSON.stringify(balanceResponse.data, null, 2))
        }

        const positionsResponse = await SnapTradeService.client.accountInformation.getUserAccountPositions({
          userId: user.snapTrade.userId,
          userSecret: user.snapTrade.userSecret,
          accountId: account.id
        })
        
        // Log Webull positions specifically
        if (account.institution_name === 'Webull') {
          console.log('Webull positions response:', JSON.stringify(positionsResponse.data, null, 2))
        }
        
        if (positionsResponse.data?.length) {
          allPositions.push(...positionsResponse.data)
        }
      } catch (error) {
        if (error instanceof Error) {
          return new NextResponse(error.message, { status: 500 })
        }
      }
    }

    if (!allPositions?.length) {
      return NextResponse.json({
        positions: {
          stocks: [],
          crypto: []
        },
        stockDayChange: 0,
        cryptoDayChange: 0,
        totals: { stock: 0, crypto: 0, total: 0 }
      })
    }

    const processedPositions = allPositions.map(position => {
      const units = position.units ?? 0
      const price = position.price ?? 0
      const marketValue = position.market_value ?? (units * price)
      
      let symbol = ''
      if (typeof position.symbol === 'object' && position.symbol !== null) {
        if ('symbol' in position.symbol) {
          symbol = typeof position.symbol.symbol === 'string' 
            ? position.symbol.symbol 
            : position.symbol.symbol?.symbol || ''
        }
      } else if (typeof position.symbol === 'string') {
        symbol = position.symbol
      }
      
      symbol = symbol.replace(/\.TO$/, '')
      
      const securityType = position.symbol?.symbol?.type?.code === 'crypto' ? 'CRYPTO' : 'STOCK'

      const averagePurchasePrice = position.average_purchase_price ?? 0
      const unrealizedPL = position.open_pnl ?? 0
      const unrealizedPLPercent = averagePurchasePrice && units
        ? ((marketValue - (averagePurchasePrice * units)) / (averagePurchasePrice * units)) * 100 
        : 0

      return {
        symbol,
        quantity: units,
        marketValue,
        averageCost: averagePurchasePrice,
        unrealizedPL,
        unrealizedPLPercent,
        lastPrice: price,
        currency: position.symbol?.currency?.code || 'USD',
        securityType,
      }
    })

    const stockPositions = processedPositions.filter(p => p.securityType === 'STOCK')
    const cryptoPositions = processedPositions.filter(p => p.securityType === 'CRYPTO')

    const stockTotal = stockPositions.reduce((sum, p) => sum + p.marketValue, 0)
    const cryptoTotal = cryptoPositions.reduce((sum, p) => sum + p.marketValue, 0)

    const response = {
      positions: {
        stocks: stockPositions,
        crypto: cryptoPositions
      },
      stockDayChange: stockTotal * 0.01,
      cryptoDayChange: cryptoTotal * 0.02,
      totals: {
        stock: stockTotal,
        crypto: cryptoTotal,
        total: stockTotal + cryptoTotal
      }
    }

    return NextResponse.json(response)
  } catch (error) {
    return new NextResponse(error instanceof Error ? error.message : 'Internal Server Error', { status: 500 })
  }
} 