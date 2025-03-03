'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface Position {
  id: string
  trader: {
    name: string
    avatar?: string
  }
  symbol: string
  type: 'long' | 'short'
  entry: number
  current: number
  size: number
  pnl: number
  pnlPercentage: number
  timestamp: string
}

interface OpenPositionsProps {
  traceId: string
}

export function OpenPositions({ traceId }: OpenPositionsProps) {
  // TODO: Fetch real positions from API
  const positions: Position[] = [
    {
      id: '1',
      trader: {
        name: 'John Doe',
        avatar: '/placeholder-avatar.jpg'
      },
      symbol: 'BTC/USD',
      type: 'long',
      entry: 65000,
      current: 67500,
      size: 1.5,
      pnl: 3750,
      pnlPercentage: 3.85,
      timestamp: '2024-02-29T12:00:00Z'
    },
    {
      id: '2',
      trader: {
        name: 'Jane Smith',
        avatar: '/placeholder-avatar.jpg'
      },
      symbol: 'ETH/USD',
      type: 'short',
      entry: 3200,
      current: 3150,
      size: 10,
      pnl: 500,
      pnlPercentage: 1.56,
      timestamp: '2024-02-29T11:30:00Z'
    }
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">Open Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {positions.map((position) => (
              <Card key={position.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={position.trader.avatar} />
                        <AvatarFallback>{position.trader.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{position.trader.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(position.timestamp).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <Badge variant={position.type === 'long' ? 'default' : 'destructive'}>
                      {position.type.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Symbol</p>
                      <p className="font-medium">{position.symbol}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Size</p>
                      <p className="font-medium">{position.size}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Entry</p>
                      <p className="font-medium">${position.entry.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Current</p>
                      <p className="font-medium">${position.current.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between border-t pt-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Unrealized P&L</p>
                      <p
                        className={`text-lg font-bold ${
                          position.pnl >= 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        ${position.pnl.toLocaleString()} ({position.pnlPercentage}%)
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
} 