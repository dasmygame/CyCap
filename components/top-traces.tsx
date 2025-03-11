'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from '@/lib/utils'
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

interface TopTrace {
  _id: string
  slug: string
  name: string
  avatar?: string
  stats: {
    memberCount: number
    tradeAlertCount: number
    winRate: number
    totalPnL: number
  }
  performance: {
    monthly: {
      pnl: number[]
      winRate: number[]
    }
  }
  avgMonthlyReturn: number
  avgWinRate: number
}

export default function TopTraces() {
  const [traces, setTraces] = useState<TopTrace[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTopTraces = async () => {
      try {
        const response = await fetch('/api/traces/top-performing')
        if (!response.ok) throw new Error('Failed to fetch traces')
        const data = await response.json()
        setTraces(data.traces)
      } catch (error) {
        console.error('Error fetching top traces:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTopTraces()
  }, [])

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[200px] w-full" />
              <div className="mt-4 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {traces.map((trace) => {
        // Prepare data for the chart with fallback for missing data
        const monthlyPnL = trace.performance?.monthly?.pnl || []
        const chartData = monthlyPnL.length > 0 
          ? monthlyPnL.map((pnl, index) => ({
              month: index,
              value: typeof pnl === 'number' ? pnl : 0
            })).slice(-6) // Show last 6 months
          : Array.from({ length: 6 }).map((_, i) => ({
              month: i,
              value: 0
            }))

        const positiveReturn = (trace.avgMonthlyReturn || 0) > 0
        const formattedReturn = ((trace.avgMonthlyReturn || 0) * 100).toFixed(1)

        return (
          <Card 
            key={trace._id}
            className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            <CardHeader className="flex flex-row items-center gap-3 pb-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={trace.avatar} />
                <AvatarFallback>{trace.name[0]}</AvatarFallback>
              </Avatar>
              <CardTitle className="text-base font-semibold line-clamp-1">
                {trace.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Chart */}
              <div className="h-[120px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke={positiveReturn ? 'hsl(var(--success))' : 'hsl(var(--destructive))'}
                      strokeWidth={2}
                      dot={false}
                    />
                    <XAxis dataKey="month" hide />
                    <YAxis hide />
                    <Tooltip 
                      content={({ payload }) => {
                        if (!payload?.length) return null
                        const value = payload[0]?.value
                        if (typeof value !== 'number') return null
                        return (
                          <div className="rounded-lg bg-background/95 p-2 shadow-md border">
                            <p className="text-sm font-medium">
                              {value > 0 ? '+' : ''}
                              {(value * 100).toFixed(2)}%
                            </p>
                          </div>
                        )
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Stats */}
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Monthly Return</span>
                  <span className={cn(
                    "text-lg font-bold tabular-nums",
                    positiveReturn ? "text-success" : "text-destructive"
                  )}>
                    {positiveReturn ? '+' : ''}{formattedReturn}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Win Rate</span>
                  <span className="text-lg font-bold tabular-nums">
                    {((trace.avgWinRate || 0) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-sm text-muted-foreground">Members</span>
                  <span className="text-lg font-bold tabular-nums">
                    {(trace.stats?.memberCount || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA Button */}
              <div className="mt-4">
                <Link href={`/t/${trace.slug}`} className="w-full">
                  <Button className="w-full group-hover:bg-primary/90">
                    View Trace
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
} 