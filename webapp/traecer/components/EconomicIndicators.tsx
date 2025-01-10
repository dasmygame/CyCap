'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
}

const inflationData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Inflation Rate',
      data: [1.4, 1.7, 2.6, 4.2, 5.0, 5.4, 5.4, 5.3, 5.4, 6.2, 6.8, 7.0],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
}

const interestRatesData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Federal Funds Rate',
      data: [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.25],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
}

const unemploymentData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  datasets: [
    {
      label: 'Unemployment Rate',
      data: [6.3, 6.2, 6.0, 6.1, 5.8, 5.9, 5.4, 5.2, 4.8, 4.6, 4.2, 3.9],
      borderColor: 'rgb(75, 192, 192)',
      backgroundColor: 'rgba(75, 192, 192, 0.5)',
    },
  ],
}

export function EconomicIndicators() {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Economic Indicators</h2>
      <Tabs defaultValue="inflation" className="w-full">
        <TabsList>
          <TabsTrigger value="inflation">Inflation</TabsTrigger>
          <TabsTrigger value="interest-rates">Interest Rates</TabsTrigger>
          <TabsTrigger value="unemployment">Unemployment</TabsTrigger>
        </TabsList>
        <TabsContent value="inflation">
          <Card>
            <CardHeader>
              <CardTitle>Inflation Rate</CardTitle>
              <CardDescription>Consumer Price Index, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <Line options={chartOptions} data={inflationData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="interest-rates">
          <Card>
            <CardHeader>
              <CardTitle>Interest Rates</CardTitle>
              <CardDescription>Federal Funds Rate, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <Line options={chartOptions} data={interestRatesData} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="unemployment">
          <Card>
            <CardHeader>
              <CardTitle>Unemployment Rate</CardTitle>
              <CardDescription>U.S. Unemployment Rate, 2023</CardDescription>
            </CardHeader>
            <CardContent>
              <Line options={chartOptions} data={unemploymentData} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

