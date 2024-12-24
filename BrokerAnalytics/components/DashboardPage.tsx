'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import OverviewChart from './OverviewChart'
import WinRateChart from './WinRateChart'
import DailyPerformanceChart from './DailyPerformanceChart'
import BrokerCredentialsForm from './BrokerCredentialsForm'
import { useTheme } from "next-themes"

export default function DashboardPage() {
  const [selectedBroker, setSelectedBroker] = useState<'webull' | 'robinhood'>('webull')
  const { theme } = useTheme()

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Broker Analytics Dashboard</h1>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="winRate">Win Rate</TabsTrigger>
          <TabsTrigger value="dailyPerformance">Daily Performance</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Account Overview</CardTitle>
              <CardDescription>Your overall account performance</CardDescription>
            </CardHeader>
            <CardContent>
              <OverviewChart broker={selectedBroker} theme={theme} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="winRate">
          <Card>
            <CardHeader>
              <CardTitle>Win Rate</CardTitle>
              <CardDescription>Your trading win rate over time</CardDescription>
            </CardHeader>
            <CardContent>
              <WinRateChart broker={selectedBroker} theme={theme} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dailyPerformance">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Your account performance day by day</CardDescription>
            </CardHeader>
            <CardContent>
              <DailyPerformanceChart broker={selectedBroker} theme={theme} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Broker Settings</CardTitle>
              <CardDescription>Connect your broker accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <BrokerCredentialsForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

