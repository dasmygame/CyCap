'use client'

// OpenPositions component displays and manages real-time trading positions
// It shows current open positions and updates them in real-time through Pusher websockets

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ITracePosition } from '@/lib/models/TracePosition'
import { formatCurrency, formatPercentage } from '@/lib/utils'

// Interface defining a trading position
interface Position {
  id: string                 // Unique identifier for the position
  trader: {
    name: string            // Name of the trader who opened the position
    avatar?: string        // Optional avatar URL for the trader
  }
  symbol: string           // Trading pair (e.g., 'BTC/USD')
  type: 'long' | 'short'   // Position type
  entry: number           // Entry price
  current: number         // Current price
  size: number           // Position size
  pnl: number           // Current profit/loss
  pnlPercentage: number // Profit/loss as a percentage
  timestamp: string     // When the position was opened
}

// Props interface for the component
interface OpenPositionsProps {
  traceId: string           // Unique identifier for the trace
  initialPositions: ITracePosition[]  // Initial list of open positions
}

export function OpenPositions({ traceId, initialPositions }: OpenPositionsProps) {
  const [positions, setPositions] = useState<ITracePosition[]>(initialPositions)

  // Fetch real-time updates
  useEffect(() => {
    // TODO: Implement WebSocket connection for real-time updates
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'position_update' && data.traceId === traceId) {
        setPositions(data.positions as ITracePosition[])
      }
    }

    return () => {
      ws.close()
    }
  }, [traceId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {positions.map((position) => (
            <div
              key={position._id?.toString() || position.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{position.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {position.type} @ {formatCurrency(position.entry)}
                </div>
              </div>
              <div className="text-right">
                <div className={position.pnl >= 0 ? 'text-green-500' : 'text-red-500'}>
                  {formatCurrency(position.pnl)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatPercentage(position.pnlPercentage)}
                </div>
              </div>
            </div>
          ))}
          {positions.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No open positions
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 