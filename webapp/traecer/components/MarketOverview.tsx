'use client'

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarketIndexCard } from './MarketIndexCard'

const indices = [
  { name: 'S&P 500', symbol: 'SPX', price: '4,769.83', change: '+0.42%', chartData: [/* ... */] },
  { name: 'Nasdaq', symbol: 'IXIC', price: '15,011.35', change: '-0.27%', chartData: [/* ... */] },
  { name: 'Dow Jones', symbol: 'DJI', price: '37,715.04', change: '+0.68%', chartData: [/* ... */] },
  { name: 'Russell 2000', symbol: 'RUT', price: '2,012.05', change: '-0.51%', chartData: [/* ... */] },
  { name: 'VIX', symbol: 'VIX', price: '12.83', change: '-3.24%', chartData: [/* ... */] },
  { name: 'Bitcoin', symbol: 'BTC', price: '45,237.90', change: '+2.15%', chartData: [/* ... */] },
  { name: 'Gold', symbol: 'GC', price: '2,078.40', change: '+0.34%', chartData: [/* ... */] },
  { name: 'Crude Oil', symbol: 'CL', price: '71.65', change: '-1.22%', chartData: [/* ... */] },
  { name: 'EUR/USD', symbol: 'EURUSD', price: '1.1050', change: '+0.15%', chartData: [/* ... */] },
  { name: 'GBP/USD', symbol: 'GBPUSD', price: '1.2740', change: '-0.08%', chartData: [/* ... */] },
]

export function MarketOverview() {
  // const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    const container = containerRef.current
    if (!container) return

    const scrollAmount = direction === 'left' ? -400 : 400
    container.scrollLeft += scrollAmount
  }

  return (
    <div className="relative group">
      <div className="overflow-hidden" ref={containerRef}>
        <motion.div
          className="flex gap-4 py-2"
          drag="x"
          dragConstraints={containerRef}
        >
          {indices.map((index) => (
            <MarketIndexCard key={index.symbol} index={index} />
          ))}
        </motion.div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll('left')}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={() => scroll('right')}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}

