'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'

const data = [
  { date: '2023-06-01', performance: 120 },
  { date: '2023-06-02', performance: -50 },
  { date: '2023-06-03', performance: 80 },
  { date: '2023-06-04', performance: 200 },
  { date: '2023-06-05', performance: -30 },
  { date: '2023-06-06', performance: 150 },
  { date: '2023-06-07', performance: -100 },
]

export default function DailyPerformanceChart({ broker }: { broker: 'webull' | 'robinhood' }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{broker.charAt(0).toUpperCase() + broker.slice(1)} Daily Performance</CardTitle>
        <CardDescription>Account performance day by day</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="performance" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

