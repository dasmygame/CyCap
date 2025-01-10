'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

const dummyStocks = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 185.92, change: 2.45, volume: '62.3M', marketCap: '2.91T', pe: 30.5 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', price: 374.58, change: -0.27, volume: '23.1M', marketCap: '2.78T', pe: 36.2 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.93, change: 1.05, volume: '24.7M', marketCap: '1.77T', pe: 25.1 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 151.94, change: 0.68, volume: '48.2M', marketCap: '1.57T', pe: 78.3 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', price: 495.22, change: 3.21, volume: '36.9M', marketCap: '1.22T', pe: 64.7 },
]

export function StockScreener() {
  const [filters, setFilters] = useState({
    marketCap: [0, 3000],
    pe: [0, 100],
    price: [0, 500],
    volume: [0, 100],
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <Label>Market Cap (Billions)</Label>
          <Slider
            min={0}
            max={3000}
            step={10}
            value={filters.marketCap}
            onValueChange={(value) => setFilters({ ...filters, marketCap: value })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.marketCap[0]}B</span>
            <span>${filters.marketCap[1]}B</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>P/E Ratio</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.pe}
            onValueChange={(value) => setFilters({ ...filters, pe: value })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.pe[0]}</span>
            <span>{filters.pe[1]}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Price</Label>
          <Slider
            min={0}
            max={500}
            step={5}
            value={filters.price}
            onValueChange={(value) => setFilters({ ...filters, price: value })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.price[0]}</span>
            <span>${filters.price[1]}</span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Volume (Millions)</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={filters.volume}
            onValueChange={(value) => setFilters({ ...filters, volume: value })}
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{filters.volume[0]}M</span>
            <span>{filters.volume[1]}M</span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Switch id="only-profitable" />
          <Label htmlFor="only-profitable">Only show profitable companies</Label>
        </div>
        <Select defaultValue="market_cap">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="market_cap">Market Cap</SelectItem>
            <SelectItem value="price">Price</SelectItem>
            <SelectItem value="volume">Volume</SelectItem>
            <SelectItem value="pe">P/E Ratio</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Symbol</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Change</TableHead>
            <TableHead>Volume</TableHead>
            <TableHead>Market Cap</TableHead>
            <TableHead>P/E Ratio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {dummyStocks.map((stock) => (
            <TableRow key={stock.symbol}>
              <TableCell className="font-medium">{stock.symbol}</TableCell>
              <TableCell>{stock.name}</TableCell>
              <TableCell>${stock.price.toFixed(2)}</TableCell>
              <TableCell className={stock.change >= 0 ? 'text-green-500' : 'text-red-500'}>
                {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)}%
              </TableCell>
              <TableCell>{stock.volume}</TableCell>
              <TableCell>${stock.marketCap}</TableCell>
              <TableCell>{stock.pe.toFixed(1)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center">
        <Button variant="outline">Previous</Button>
        <div className="text-sm text-muted-foreground">
          Page 1 of 10
        </div>
        <Button variant="outline">Next</Button>
      </div>
    </div>
  )
}

