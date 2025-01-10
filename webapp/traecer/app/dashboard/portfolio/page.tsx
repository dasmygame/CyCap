'use client'

import { useState } from 'react'
import { TradingViewWidget } from '@/components/TradingViewWidget'
import { PortfolioGrowthChart } from '@/components/PortfolioGrowthChart'
import { X } from 'lucide-react'

const positions = [
  {
    symbol: 'AAPL',
    type: 'LONG',
    entry: 175.50,
    current: 178.25,
    quantity: 10,
    pnl: 27.50,
    pnlPercent: 1.57,
    stopLoss: 172.30,
    takeProfit: 180.00,
    bid: 178.20,
    ask: 178.30
  },
  {
    symbol: 'NVDA',
    type: 'SHORT',
    entry: 485.20,
    current: 482.15,
    quantity: 5,
    pnl: 15.25,
    pnlPercent: 0.63,
    stopLoss: 489.50,
    takeProfit: 475.00,
    bid: 482.10,
    ask: 482.20
  }
]

interface OrderManagementModalProps {
  position: typeof positions[0]
  onClose: () => void
}

function OrderManagementModal({ position, onClose }: OrderManagementModalProps) {
  const [orderType, setOrderType] = useState<'limit' | 'stop' | 'takeProfit'>('limit')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState(position.quantity.toString())

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card w-full max-w-md rounded-lg border border-border p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">{position.symbol} Position Management</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Order Type</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                className={`px-4 py-2 rounded-lg border ${
                  orderType === 'limit' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border hover:bg-secondary'
                }`}
                onClick={() => setOrderType('limit')}
              >
                Limit
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  orderType === 'stop' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border hover:bg-secondary'
                }`}
                onClick={() => setOrderType('stop')}
              >
                Stop Loss
              </button>
              <button
                className={`px-4 py-2 rounded-lg border ${
                  orderType === 'takeProfit' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'border-border hover:bg-secondary'
                }`}
                onClick={() => setOrderType('takeProfit')}
              >
                Take Profit
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Price (Current Bid: ${position.bid} / Ask: ${position.ask})
            </label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg border border-border"
              placeholder="Enter price"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-3 py-2 bg-secondary rounded-lg border border-border"
              placeholder="Enter quantity"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90"
              onClick={() => {
                // Handle order submission
                console.log('Order submitted:', { orderType, price, quantity })
                onClose()
              }}
            >
              Place Order
            </button>
            <button
              className="flex-1 bg-secondary py-2 rounded-lg hover:bg-secondary/80"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PortfolioPage() {
  const [selectedPosition, setSelectedPosition] = useState(positions[0])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [managingPosition, setManagingPosition] = useState<typeof positions[0] | null>(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Portfolio Overview</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Total Value</div>
          <div className="text-2xl font-medium">$25,432.39</div>
          <div className="text-sm text-primary mt-1">+2.5% today</div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Open P&L</div>
          <div className="text-2xl font-medium text-primary">+$427.80</div>
          <div className="text-sm text-muted-foreground mt-1">Across 5 positions</div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Win Rate</div>
          <div className="text-2xl font-medium">68%</div>
          <div className="text-sm text-muted-foreground mt-1">Last 30 days</div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">Risk Level</div>
          <div className="text-2xl font-medium">Medium</div>
          <div className="text-sm text-yellow-500 mt-1">2.1% account risk</div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8">
          <div className="bg-card rounded-lg border border-border">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-medium">Chart</h2>
            </div>
            <div className="h-[500px]">
              <TradingViewWidget 
                symbol={`NASDAQ:${selectedPosition.symbol}`}
                theme="dark"
                style="1"
              />
            </div>
          </div>
        </div>
        <div className="col-span-4">
          <div className="bg-card rounded-lg border border-border h-full">
            <div className="p-4 border-b border-border">
              <h2 className="text-lg font-medium">Portfolio Growth</h2>
            </div>
            <div className="h-[500px] p-4">
              <PortfolioGrowthChart />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-4 border-b border-border">
          <h2 className="text-lg font-medium">Open Positions</h2>
        </div>
        <div className="p-4">
          <table className="w-full">
            <thead>
              <tr className="text-left text-muted-foreground">
                <th className="pb-2">Symbol</th>
                <th className="pb-2">Type</th>
                <th className="pb-2">Entry</th>
                <th className="pb-2">Current</th>
                <th className="pb-2">Quantity</th>
                <th className="pb-2">P&L</th>
                <th className="pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {positions.map((position) => (
                <tr 
                  key={position.symbol} 
                  className={`border-t border-border cursor-pointer transition-colors ${
                    selectedPosition.symbol === position.symbol ? 'bg-secondary' : 'hover:bg-secondary/50'
                  }`}
                  onClick={() => setSelectedPosition(position)}
                >
                  <td className="py-2">{position.symbol}</td>
                  <td className="py-2">{position.type}</td>
                  <td className="py-2">${position.entry.toFixed(2)}</td>
                  <td className="py-2">${position.current.toFixed(2)}</td>
                  <td className="py-2">{position.quantity}</td>
                  <td className={`py-2 ${position.pnl >= 0 ? 'text-primary' : 'text-red-500'}`}>
                    ${position.pnl.toFixed(2)} ({position.pnlPercent.toFixed(2)}%)
                  </td>
                  <td className="py-2">
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          setManagingPosition(position)
                        }}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-lg text-sm hover:bg-primary/90"
                      >
                        Manage
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation()
                          console.log('Closing position:', position.symbol)
                        }}
                        className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        Close
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {managingPosition && (
        <OrderManagementModal
          position={managingPosition}
          onClose={() => setManagingPosition(null)}
        />
      )}
    </div>
  )
}

