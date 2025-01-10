'use client'

import React, { useEffect, useRef, useState } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js'
import { Line } from 'react-chartjs-2'
import { format, isWithinInterval, setHours, setMinutes } from 'date-fns'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const generateDummyData = () => {
  const data = []
  let value = 10000
  for (let i = 0; i < 30; i++) {
    value = value * (1 + (0.5 - Math.random()) * 0.02)
    data.push({ date: new Date(2024, 0, i + 1), value: value })
  }
  return data
}

const dummyData = generateDummyData();

const isMarketOpen = (date: Date) => {
  const marketOpen = setMinutes(setHours(date, 4), 0)
  const marketClose = setMinutes(setHours(date, 20), 0)
  return isWithinInterval(date, { start: marketOpen, end: marketClose })
}

export function PortfolioGrowthChart() {
  const chartRef = useRef<ChartJS>(null)
  const [chartData, setChartData] = useState<any>(null);
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [marketStatus, setMarketStatus] = useState<boolean | null>(null);

  useEffect(() => {
    setChartData({
      labels: dummyData.map(d => format(d.date, 'MMM dd')),
      datasets: [
        {
          label: 'Portfolio Value',
          data: dummyData.map(d => d.value),
          borderColor: function(context: any) {
            const chart = context.chart
            const {ctx, chartArea} = chart
            if (!chartArea) {
              return null
            }
            return getGradient(ctx, chartArea, marketStatus)
          },
          tension: 0.4,
        }
      ]
    });
    const now = new Date();
    setCurrentTime(now);
    setMarketStatus(isMarketOpen(now));

    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      setMarketStatus(isMarketOpen(now));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getGradient = (ctx: CanvasRenderingContext2D, chartArea: { left: number; right: number; top: number; bottom: number }, isFlowing: boolean) => {
    const gradientBg = ctx.createLinearGradient(chartArea.left, 0, chartArea.right, 0)
    if (isFlowing) {
      const time = Date.now() / 1000
      gradientBg.addColorStop((Math.sin(time) + 1) / 2, 'rgba(0, 100, 255, 1)')
      gradientBg.addColorStop((Math.sin(time + Math.PI) + 1) / 2, 'rgba(128, 0, 255, 1)')
    } else {
      gradientBg.addColorStop(0, 'rgba(0, 100, 255, 1)')
      gradientBg.addColorStop(1, 'rgba(128, 0, 255, 1)')
    }
    return gradientBg
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 0
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        type: 'category' as const,
        grid: {
          display: false,
        },
      },
      y: {
        type: 'linear' as const,
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
        ticks: {
          callback: function(value: any) {
            return '$' + value.toLocaleString()
          }
        }
      }
    },
  }

  if (!chartData || currentTime === null || marketStatus === null) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-full">
      <Line ref={chartRef} data={chartData} options={options} />
      <div className="absolute top-4 right-4 bg-card p-2 rounded-lg border border-border">
        <div className="text-sm font-medium">{format(currentTime, 'h:mm:ss a')}</div>
        <div className={`text-xs ${marketStatus ? 'text-primary' : 'text-red-500'}`}>
          Market {marketStatus ? 'Open' : 'Closed'}
        </div>
      </div>
    </div>
  )
}

