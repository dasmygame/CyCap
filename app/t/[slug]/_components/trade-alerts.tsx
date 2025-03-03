'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useChat } from '@/hooks/useChat'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BellPlus } from 'lucide-react'

interface TradeAlertsProps {
  traceId: string
}

interface TradeAlert {
  id: string
  trader: {
    name: string
    avatar?: string
  }
  type: 'entry' | 'exit' | 'stop_loss' | 'take_profit'
  symbol: string
  direction: 'long' | 'short'
  price: number
  reason: string
  timestamp: string
}

export function TradeAlerts({ traceId }: TradeAlertsProps) {
  const { data: session } = useSession()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { sendMessage } = useChat({ channelId: traceId })

  // TODO: Fetch real alerts from API
  const alerts: TradeAlert[] = [
    {
      id: '1',
      trader: {
        name: 'John Doe',
        avatar: '/placeholder-avatar.jpg'
      },
      type: 'entry',
      symbol: 'BTC/USD',
      direction: 'long',
      price: 65000,
      reason: 'Breaking out of key resistance level with increasing volume.',
      timestamp: '2024-02-29T12:00:00Z'
    },
    {
      id: '2',
      trader: {
        name: 'Jane Smith',
        avatar: '/placeholder-avatar.jpg'
      },
      type: 'stop_loss',
      symbol: 'ETH/USD',
      direction: 'short',
      price: 3250,
      reason: 'Protecting profits as market shows signs of reversal.',
      timestamp: '2024-02-29T11:30:00Z'
    }
  ]

  const handleSubmitAlert = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const data = {
      type: formData.get('type'),
      symbol: formData.get('symbol'),
      direction: formData.get('direction'),
      price: formData.get('price'),
      reason: formData.get('reason')
    }

    // TODO: Submit to API
    await sendMessage(JSON.stringify({
      type: 'trade_alert',
      ...data
    }))

    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Trade Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <Card key={alert.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={alert.trader.avatar} />
                            <AvatarFallback>{alert.trader.name[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{alert.trader.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(alert.timestamp).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={alert.direction === 'long' ? 'default' : 'destructive'}>
                            {alert.direction.toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">
                            {alert.type.replace('_', ' ').toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Symbol</p>
                          <p className="font-medium">{alert.symbol}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Price</p>
                          <p className="font-medium">${alert.price.toLocaleString()}</p>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-4">
                        <p className="text-sm text-muted-foreground">Reason</p>
                        <p className="mt-1 text-sm">{alert.reason}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-4" size="icon">
              <BellPlus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Trade Alert</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmitAlert} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Select name="type" defaultValue="entry">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry</SelectItem>
                      <SelectItem value="exit">Exit</SelectItem>
                      <SelectItem value="stop_loss">Stop Loss</SelectItem>
                      <SelectItem value="take_profit">Take Profit</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direction">Direction</Label>
                  <Select name="direction" defaultValue="long">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="long">Long</SelectItem>
                      <SelectItem value="short">Short</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="symbol">Symbol</Label>
                  <Input name="symbol" placeholder="BTC/USD" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input name="price" type="number" step="0.01" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea
                  name="reason"
                  placeholder="Explain your trading rationale..."
                  className="h-20"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Alert
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
} 