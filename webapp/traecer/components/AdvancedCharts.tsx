'use client'

import { useState } from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TradingViewWidget } from './TradingViewWidget'

export function AdvancedCharts() {
  const [symbol, setSymbol] = useState('NASDAQ:AAPL')

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Advanced Charts</h2>
        <Select
          value={symbol}
          onValueChange={setSymbol}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select symbol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="NASDAQ:AAPL">Apple (AAPL)</SelectItem>
            <SelectItem value="NASDAQ:MSFT">Microsoft (MSFT)</SelectItem>
            <SelectItem value="NASDAQ:GOOGL">Alphabet (GOOGL)</SelectItem>
            <SelectItem value="NASDAQ:AMZN">Amazon (AMZN)</SelectItem>
            <SelectItem value="NYSE:JPM">JPMorgan Chase (JPM)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-[600px] bg-card rounded-lg border border-border/50">
        <TradingViewWidget symbol={symbol} />
      </div>
    </div>
  )
}

