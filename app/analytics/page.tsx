'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { PageContainer } from "@/components/page-container"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils/format"

interface Position {
  symbol: string
  quantity: number
  marketValue: number
  averageCost: number
  unrealizedPL: number
  unrealizedPLPercent: number
  lastPrice: number
  currency: string
  securityType: string
}

interface PortfolioMetrics {
  totalValue: number
  dayChange: number
  dayChangePercent: number
  totalGain: number
  totalGainPercent: number
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [stockPositions, setStockPositions] = useState<Position[]>([])
  const [cryptoPositions, setCryptoPositions] = useState<Position[]>([])
  const [stockMetrics, setStockMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
    totalGain: 0,
    totalGainPercent: 0
  })
  const [cryptoMetrics, setCryptoMetrics] = useState<PortfolioMetrics>({
    totalValue: 0,
    dayChange: 0,
    dayChangePercent: 0,
    totalGain: 0,
    totalGainPercent: 0
  })

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await fetch('/api/snaptrade/positions')
        if (!response.ok) throw new Error('Failed to fetch positions')
        const data = await response.json()
        
        // Separate crypto and stock positions
        const stocks: Position[] = []
        const crypto: Position[] = []
        let stockValue = 0
        let cryptoValue = 0
        let stockGain = 0
        let cryptoGain = 0

        data.positions.forEach((position: Position) => {
          if (position.securityType === 'CRYPTO') {
            crypto.push(position)
            cryptoValue += position.marketValue
            cryptoGain += position.unrealizedPL
          } else {
            stocks.push(position)
            stockValue += position.marketValue
            stockGain += position.unrealizedPL
          }
        })

        setStockPositions(stocks)
        setCryptoPositions(crypto)
        setStockMetrics({
          totalValue: stockValue,
          dayChange: data.stockDayChange || 0,
          dayChangePercent: (data.stockDayChange / stockValue) * 100 || 0,
          totalGain: stockGain,
          totalGainPercent: (stockGain / stockValue) * 100
        })
        setCryptoMetrics({
          totalValue: cryptoValue,
          dayChange: data.cryptoDayChange || 0,
          dayChangePercent: (data.cryptoDayChange / cryptoValue) * 100 || 0,
          totalGain: cryptoGain,
          totalGainPercent: (cryptoGain / cryptoValue) * 100
        })
      } catch (error) {
        console.error('Error fetching positions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (session) {
      fetchPositions()
    }
  }, [session])

  if (status === "loading" || isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </PageContainer>
    )
  }

  if (status === "unauthenticated") {
    router.replace("/auth/sign-in")
    return null
  }

  const PortfolioMetricsCard = ({ metrics }: { metrics: PortfolioMetrics }) => (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Value</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(metrics.totalValue)}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Day Change</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.dayChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(metrics.dayChange)} ({metrics.dayChangePercent.toFixed(2)}%)
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Gain/Loss</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${metrics.totalGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(metrics.totalGain)} ({metrics.totalGainPercent.toFixed(2)}%)
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const PositionsTable = ({ positions }: { positions: Position[] }) => (
    <div className="rounded-md border">
      <div className="grid grid-cols-7 gap-4 p-4 font-medium">
        <div>Symbol</div>
        <div>Quantity</div>
        <div>Last Price</div>
        <div>Market Value</div>
        <div>Avg Cost</div>
        <div>Unrealized P/L</div>
        <div>P/L %</div>
      </div>
      <Separator />
      {positions.map((position, index) => (
        <div key={position.symbol}>
          <div className="grid grid-cols-7 gap-4 p-4">
            <div className="font-medium">{position.symbol}</div>
            <div>{position.quantity.toFixed(position.securityType === 'CRYPTO' ? 8 : 2)}</div>
            <div>{formatCurrency(position.lastPrice)}</div>
            <div>{formatCurrency(position.marketValue)}</div>
            <div>{formatCurrency(position.averageCost)}</div>
            <div className={position.unrealizedPL >= 0 ? 'text-green-500' : 'text-red-500'}>
              {formatCurrency(position.unrealizedPL)}
            </div>
            <div className={position.unrealizedPLPercent >= 0 ? 'text-green-500' : 'text-red-500'}>
              {position.unrealizedPLPercent.toFixed(2)}%
            </div>
          </div>
          {index < positions.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  )

  return (
    <PageContainer>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
        </div>
        <Tabs defaultValue="stocks" className="space-y-4">
          <TabsList>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
            <TabsTrigger value="crypto">Crypto</TabsTrigger>
          </TabsList>
          <TabsContent value="stocks" className="space-y-4">
            <PortfolioMetricsCard metrics={stockMetrics} />
            <Card>
              <CardHeader>
                <CardTitle>Stock Positions</CardTitle>
                <CardDescription>
                  Your current stock portfolio positions and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stockPositions.length > 0 ? (
                  <PositionsTable positions={stockPositions} />
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No stock positions found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="crypto" className="space-y-4">
            <PortfolioMetricsCard metrics={cryptoMetrics} />
            <Card>
              <CardHeader>
                <CardTitle>Crypto Positions</CardTitle>
                <CardDescription>
                  Your current cryptocurrency positions and performance
                </CardDescription>
              </CardHeader>
              <CardContent>
                {cryptoPositions.length > 0 ? (
                  <PositionsTable positions={cryptoPositions} />
                ) : (
                  <div className="text-center py-4 text-muted-foreground">
                    No crypto positions found
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  )
} 