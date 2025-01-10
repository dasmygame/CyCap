'use client'

import { TrendingUp, TrendingDown } from 'lucide-react'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler
)

interface MarketIndexCardProps {
  index: {
    name: string
    symbol: string
    price: string
    change: string
    chartData: number[]
  }
}

export function MarketIndexCard({ index }: MarketIndexCardProps) {
  const isPositive = index.change.startsWith('+')

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false }
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    },
    elements: {
      point: { radius: 0 },
      line: { tension: 0.4 }
    }
  }

  const chartData = {
    labels: index.chartData.map((_, i) => i.toString()),
    datasets: [
      {
        data: index.chartData,
        borderColor: isPositive ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)',
        backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
        fill: true,
      }
    ]
  }

  return (
    <div className="flex-none w-[300px] bg-card rounded-lg border border-border/50 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{index.name}</h3>
          <p className="text-sm text-muted-foreground">{index.symbol}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-500" />
        )}
      </div>
      <div className="flex justify-between items-end mb-2">
        <span className="text-2xl font-mono">{index.price}</span>
        <span className={`text-sm ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {index.change}
        </span>
      </div>
      <div className="h-[50px]">
        <Line options={chartOptions} data={chartData} />
      </div>
    </div>
  )
}

