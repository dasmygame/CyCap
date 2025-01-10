'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, DollarSign, BarChart2, AlertCircle } from 'lucide-react'

const stockData = [
  { date: '2023-01-01', price: 150 },
  { date: '2023-02-01', price: 155 },
  { date: '2023-03-01', price: 160 },
  { date: '2023-04-01', price: 158 },
  { date: '2023-05-01', price: 165 },
  { date: '2023-06-01', price: 170 },
]

const technicalIndicators = [
  { name: 'RSI', value: 65, status: 'Neutral' },
  { name: 'MACD', value: 0.5, status: 'Bullish' },
  { name: 'Moving Average (50)', value: 162, status: 'Above' },
  { name: 'Bollinger Bands', value: 'Upper', status: 'Overbought' },
]

const newsItems = [
  { title: 'Q2 Earnings Beat Expectations', time: '2 hours ago', sentiment: 'Positive' },
  { title: 'New Product Launch Announced', time: '1 day ago', sentiment: 'Positive' },
  { title: 'Industry Regulations Tightening', time: '3 days ago', sentiment: 'Negative' },
]

export default function StockAnalysis() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-display font-bold mb-6">Stock Analysis: AAPL</h1>
      
      {/* Stock Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-card border border-border p-6"
      >
        <h2 className="text-xl font-display font-semibold mb-4">Price Chart</h2>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stockData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
              <XAxis 
                dataKey="date" 
                stroke="#525252" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                stroke="#525252" 
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#171717',
                  border: '1px solid #262626',
                  fontSize: '12px',
                  padding: '8px',
                  fontFamily: 'var(--font-mono)'
                }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#00FF7F"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Technical Indicators */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border p-6"
      >
        <h2 className="text-xl font-display font-semibold mb-4">Technical Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {technicalIndicators.map((indicator, index) => (
            <div key={index} className="bg-secondary p-4 border border-border">
              <h3 className="text-sm font-sans font-medium mb-2">{indicator.name}</h3>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-mono">{indicator.value}</span>
                <span className={`text-sm ${
                  indicator.status === 'Bullish' ? 'text-[#00FF7F]' : 
                  indicator.status === 'Bearish' ? 'text-red-500' : 
                  'text-yellow-500'
                }`}>{indicator.status}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* News and Sentiment */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border p-6"
      >
        <h2 className="text-xl font-display font-semibold mb-4">News and Sentiment</h2>
        <div className="space-y-4">
          {newsItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-secondary border border-border">
              <div>
                <h3 className="font-sans font-medium mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.time}</p>
              </div>
              <span className={`text-sm ${
                item.sentiment === 'Positive' ? 'text-[#00FF7F]' : 'text-red-500'
              }`}>{item.sentiment}</span>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}

