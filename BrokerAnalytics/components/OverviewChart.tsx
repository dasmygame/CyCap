'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { date: '2023-01-01', value: 10000 },
  { date: '2023-02-01', value: 11200 },
  { date: '2023-03-01', value: 10800 },
  { date: '2023-04-01', value: 12500 },
  { date: '2023-05-01', value: 13100 },
  { date: '2023-06-01', value: 14000 },
]

export default function OverviewChart({ broker, theme }: { broker: 'webull' | 'robinhood', theme?: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{broker.charAt(0).toUpperCase() + broker.slice(1)} Account Overview</CardTitle>
        <CardDescription>Total account value over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} />
              <XAxis dataKey="date" stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
              <YAxis stroke={theme === 'dark' ? '#9ca3af' : '#4b5563'} />
              <Tooltip contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#ffffff', borderColor: theme === 'dark' ? '#374151' : '#e5e7eb' }} />
              <Area type="monotone" dataKey="value" stroke="#8884d8" fill={theme === 'dark' ? 'rgba(136, 132, 216, 0.2)' : 'rgba(136, 132, 216, 0.6)'} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

