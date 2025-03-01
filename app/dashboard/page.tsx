'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { 
  LineChart, 
  TrendingUp, 
  Users, 
  BookMarked,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

interface Position {
  symbol: string
  shares: number
  averagePrice: number
  currentPrice: number
  profitLoss: number
  profitLossPercentage: number
}

interface Community {
  id: string
  name: string
  members: string[]
  avatar: string
  description: string
}

interface PortfolioStats {
  totalValue: number
  totalProfitLoss: number
  percentageChange: number
}

export default function DashboardPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [positions, setPositions] = useState<Position[]>([])
  const [communities, setCommunities] = useState<Community[]>([])
  const [portfolioStats, setPortfolioStats] = useState<PortfolioStats>({
    totalValue: 0,
    totalProfitLoss: 0,
    percentageChange: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/sign-in')
      return
    }

    if (status === 'authenticated') {
      const fetchDashboardData = async () => {
        try {
          const res = await fetch('/api/dashboard', {
            headers: {
              'Content-Type': 'application/json',
            }
          })

          if (res.status === 401) {
            router.replace('/auth/sign-in')
            return
          }

          const data = await res.json()

          if (!res.ok) {
            throw new Error(data.message || 'Failed to fetch dashboard data')
          }

          setPositions(data.positions)
          setCommunities(data.communities)
          setPortfolioStats(data.portfolioStats)
        } catch (err) {
          if (err instanceof Error) {
            setError(err.message)
          } else {
            setError('An unexpected error occurred')
          }
        } finally {
          setIsLoading(false)
        }
      }

      fetchDashboardData()
    }
  }, [status, router])

  if (status === 'loading' || isLoading) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <Card>
          <CardContent className="py-10">
            <div className="text-center">Loading dashboard data...</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6 pt-24">
        <Card>
          <CardContent className="py-10">
            <div className="text-center text-red-600">{error}</div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 pt-24">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Portfolio Value
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${portfolioStats.totalValue.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {portfolioStats.percentageChange >= 0 ? '+' : ''}
              {portfolioStats.percentageChange.toFixed(2)}% total return
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Gain/Loss
            </CardTitle>
            <LineChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${
              portfolioStats.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {portfolioStats.totalProfitLoss >= 0 ? '+' : ''}
              ${portfolioStats.totalProfitLoss.toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              All time P/L
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Positions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{positions.length}</div>
            <p className="text-xs text-muted-foreground">
              Across {positions.length} symbols
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Open Positions */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Open Positions</CardTitle>
          <CardDescription>Your current stock market positions</CardDescription>
        </CardHeader>
        <CardContent>
          {positions.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No open positions. Start trading to see your positions here.
            </div>
          ) : (
            <div className="space-y-4">
              {positions.map((position) => (
                <div
                  key={position.symbol}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <div className="font-bold">{position.symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {position.shares} shares @ ${position.averagePrice.toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-right font-bold">
                      ${position.currentPrice.toFixed(2)}
                    </div>
                    <div className={`text-sm flex items-center justify-end ${
                      position.profitLoss >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {position.profitLoss >= 0 ? (
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                      )}
                      ${Math.abs(position.profitLoss).toFixed(2)} ({position.profitLossPercentage.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Communities */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Your Communities</CardTitle>
          <CardDescription>Communities you&apos;re subscribed to</CardDescription>
        </CardHeader>
        <CardContent>
          {communities.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              You haven&apos;t joined any communities yet. Join one to connect with other investors!
            </div>
          ) : (
            <div className="space-y-4">
              {communities.map((community) => (
                <div
                  key={community.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={community.avatar} />
                      <AvatarFallback>{community.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-bold">{community.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {community.members.length.toLocaleString()} members
                      </div>
                    </div>
                  </div>
                  <Button variant="outline">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">New Trade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button className="w-full">Place Order</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Join Community</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">Browse Communities</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
            <BookMarked className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">View Watchlist</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 