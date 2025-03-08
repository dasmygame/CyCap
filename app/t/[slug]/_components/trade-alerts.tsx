'use client'

// TradeAlerts component manages and displays real-time trading alerts
// It allows users to create new alerts and view existing ones in real-time

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ITraceAlert } from '@/lib/models/types'
import { formatCurrency } from '@/lib/utils'

type Alert = Omit<ITraceAlert, 'createdAt' | 'updatedAt'>

// Props interface for the component
interface TradeAlertsProps {
  traceId: string           // Unique identifier for the trace
  initialAlerts: Alert[]  // Initial list of trade alerts
}

export function TradeAlerts({ traceId, initialAlerts }: TradeAlertsProps) {
  // State for managing the list of alerts
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts)

  // Fetch real-time updates
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001')
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data)
      if (data.type === 'alert_update' && data.traceId === traceId) {
        setAlerts(data.alerts as Alert[])
      }
    }

    return () => {
      ws.close()
    }
  }, [traceId])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Trade Alerts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {alerts.map((alert) => (
            <div
              key={alert._id?.toString() || alert.id}
              className="flex items-center justify-between p-4 rounded-lg border"
            >
              <div>
                <div className="font-medium">{alert.symbol}</div>
                <div className="text-sm text-muted-foreground">
                  {alert.type} @ {formatCurrency(alert.price)}
                </div>
              </div>
              <div className="text-right">
                <div className={`text-sm ${
                  alert.status === 'active' ? 'text-green-500' :
                  alert.status === 'triggered' ? 'text-blue-500' :
                  'text-muted-foreground'
                }`}>
                  {alert.status}
                </div>
                {alert.direction && (
                  <div className="text-xs text-muted-foreground">
                    {alert.direction}
                  </div>
                )}
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No active alerts
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
} 