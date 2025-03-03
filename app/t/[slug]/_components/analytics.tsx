'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface TraceAnalyticsProps {
  traceId: string // TODO: Will be used when implementing API integration
}

interface TradeStats {
  totalTrades: number
  winRate: number
  profitFactor: number
  averageRR: number
  totalPnL: number
  bestTrade: number
  worstTrade: number
  averageDuration: string
}

interface PerformanceMetrics {
  daily: {
    trades: number
    pnl: number
    winRate: number
  }
  weekly: {
    trades: number
    pnl: number
    winRate: number
  }
  monthly: {
    trades: number
    pnl: number
    winRate: number
  }
}

export function TraceAnalytics({ traceId }: TraceAnalyticsProps) {
  // TODO: Fetch real analytics from API
  const stats: TradeStats = {
    totalTrades: 156,
    winRate: 64.7,
    profitFactor: 2.8,
    averageRR: 1.5,
    totalPnL: 45750,
    bestTrade: 12500,
    worstTrade: -3200,
    averageDuration: '4h 23m'
  }

  const performance: PerformanceMetrics = {
    daily: {
      trades: 8,
      pnl: 1250,
      winRate: 75
    },
    weekly: {
      trades: 42,
      pnl: 8500,
      winRate: 68.3
    },
    monthly: {
      trades: 156,
      pnl: 45750,
      winRate: 64.7
    }
  }

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Trades</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTrades}</div>
            <p className="text-xs text-muted-foreground">Across all timeframes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Win Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.winRate}%</div>
            <p className="text-xs text-muted-foreground">Success ratio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Profit Factor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.profitFactor}</div>
            <p className="text-xs text-muted-foreground">Wins / Losses ratio</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average R:R</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRR}</div>
            <p className="text-xs text-muted-foreground">Risk-reward ratio</p>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">Performance Metrics</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="daily" className="space-y-4">
            <TabsList>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="weekly">Weekly</TabsTrigger>
              <TabsTrigger value="monthly">Monthly</TabsTrigger>
            </TabsList>

            <TabsContent value="daily">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                  <p className="text-2xl font-bold">{performance.daily.trades}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p className={`text-2xl font-bold ${performance.daily.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${performance.daily.pnl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{performance.daily.winRate}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="weekly">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                  <p className="text-2xl font-bold">{performance.weekly.trades}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p className={`text-2xl font-bold ${performance.weekly.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${performance.weekly.pnl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{performance.weekly.winRate}%</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monthly">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-muted-foreground">Trades</p>
                  <p className="text-2xl font-bold">{performance.monthly.trades}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">P&L</p>
                  <p className={`text-2xl font-bold ${performance.monthly.pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    ${performance.monthly.pnl.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Win Rate</p>
                  <p className="text-2xl font-bold">{performance.monthly.winRate}%</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Additional Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              ${stats.bestTrade.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Highest profit</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Worst Trade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">
              ${stats.worstTrade.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">Largest loss</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageDuration}</div>
            <p className="text-xs text-muted-foreground">Time in trade</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 