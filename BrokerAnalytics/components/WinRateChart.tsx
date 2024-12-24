'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { date: '2023-01-01', winRate: 0.52 },
  { date: '2023-02-01', winRate: 0.55 },
  { date: '2023-03-01', winRate: 0.58 },
  { date: '2023-04-01', winRate: 0.54 },
  { date: '2023-05-01', winRate: 0.60 },
  { date: '2023-06-01', winRate: 0.62 },
]

export default function WinRateChart({ broker }: { broker: 'webull' | 'robinhood' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{broker.charAt(0).toUpperCase() + broker.slice(1)} Win Rate</CardTitle>
        <CardDescription>Trading win rate over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="winRate" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

