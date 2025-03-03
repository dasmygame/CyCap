'use client'

// TraceAnalytics component displays real-time trading statistics and performance metrics
// It receives initial data and updates in real-time through Pusher websockets

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency, formatPercentage } from '@/lib/utils'

// Props interface for the component
interface TraceAnalyticsProps {
  traceId: string                    // Unique identifier for the trace
  initialStats: TraceStats          // Initial trading statistics
  initialPerformance: PerformanceMetrics  // Initial performance data
}

// Interface for performance metrics across different timeframes
interface PerformanceMetrics {
  daily: {
    trades: number    // Number of trades today
    pnl: number      // Today's profit/loss
    winRate: number  // Today's win rate
  }
  weekly: {
    trades: number    // Number of trades this week
    pnl: number      // This week's profit/loss
    winRate: number  // This week's win rate
  }
  monthly: {
    trades: number    // Number of trades this month
    pnl: number      // This month's profit/loss
    winRate: number  // This month's win rate
  }
}

interface TraceStats {
  totalTrades: number
  winRate: number
  profitFactor: number
  averageRR: number
  totalPnL: number
  bestTrade: number
  worstTrade: number
  averageDuration: string
}

export function TraceAnalytics({ traceId, initialStats, initialPerformance }: TraceAnalyticsProps) {
  const [stats, setStats] = useState<TraceStats>(initialStats)
  const [performance, setPerformance] = useState<PerformanceMetrics>(initialPerformance)

  // Fetch real-time updates
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'stats_update' && data.traceId === traceId) {
        setStats(data.stats)
        setPerformance(data.performance)
      }
    }

    return () => {
      ws.close()
    }
  }, [traceId])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Overall Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Total Trades</dt>
              <dd className="text-sm font-medium">{stats.totalTrades}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Win Rate</dt>
              <dd className="text-sm font-medium">{formatPercentage(stats.winRate)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Profit Factor</dt>
              <dd className="text-sm font-medium">{stats.profitFactor.toFixed(2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Average R:R</dt>
              <dd className="text-sm font-medium">{stats.averageRR.toFixed(2)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Daily Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Trades</dt>
              <dd className="text-sm font-medium">{performance.daily.trades}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">P&L</dt>
              <dd className={`text-sm font-medium ${
                performance.daily.pnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(performance.daily.pnl)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Win Rate</dt>
              <dd className="text-sm font-medium">{formatPercentage(performance.daily.winRate)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Weekly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>This Week</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Trades</dt>
              <dd className="text-sm font-medium">{performance.weekly.trades}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">P&L</dt>
              <dd className={`text-sm font-medium ${
                performance.weekly.pnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(performance.weekly.pnl)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Win Rate</dt>
              <dd className="text-sm font-medium">{formatPercentage(performance.weekly.winRate)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>

      {/* Monthly Performance */}
      <Card>
        <CardHeader>
          <CardTitle>This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="space-y-2">
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Trades</dt>
              <dd className="text-sm font-medium">{performance.monthly.trades}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">P&L</dt>
              <dd className={`text-sm font-medium ${
                performance.monthly.pnl >= 0 ? 'text-green-500' : 'text-red-500'
              }`}>
                {formatCurrency(performance.monthly.pnl)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-sm text-muted-foreground">Win Rate</dt>
              <dd className="text-sm font-medium">{formatPercentage(performance.monthly.winRate)}</dd>
            </div>
          </dl>
        </CardContent>
      </Card>
    </div>
  )
} 