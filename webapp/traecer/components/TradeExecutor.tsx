'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { DollarSign, AlertCircle } from 'lucide-react'

interface TradeExecutorProps {
  symbol: string
  type: 'BUY' | 'SELL'
  entry: number
  stopLoss: number
  takeProfit: number
  onExecute: () => void
}

export function TradeExecutor({
  symbol,
  type,
  entry,
  stopLoss,
  takeProfit,
  onExecute
}: TradeExecutorProps) {
  const [isConfirming, setIsConfirming] = useState(false)
  const [quantity, setQuantity] = useState(1)

  const handleExecute = () => {
    if (!isConfirming) {
      setIsConfirming(true)
      return
    }

    onExecute()
    setIsConfirming(false)
  }

  return (
    <div className="bg-card p-6 rounded-lg border border-border">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-medium mb-2">{symbol} {type}</h3>
          <p className="text-muted-foreground">
            Entry: ${entry} • SL: ${stopLoss} • TP: ${takeProfit}
          </p>
        </div>
        <div className="bg-secondary px-3 py-1 rounded-full text-sm">
          Risk: ${((entry - stopLoss) * quantity).toFixed(2)}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted-foreground block mb-2">
            Quantity
          </label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            className="w-full bg-secondary p-2 rounded-lg border border-border"
          />
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="bg-secondary p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Entry Total</div>
            <div className="font-medium">${(entry * quantity).toFixed(2)}</div>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Potential Loss</div>
            <div className="text-red-500 font-medium">
              ${((entry - stopLoss) * quantity).toFixed(2)}
            </div>
          </div>
          <div className="bg-secondary p-3 rounded-lg">
            <div className="text-muted-foreground mb-1">Potential Profit</div>
            <div className="text-primary font-medium">
              ${((takeProfit - entry) * quantity).toFixed(2)}
            </div>
          </div>
        </div>

        <button
          onClick={handleExecute}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isConfirming
              ? 'bg-destructive text-destructive-foreground'
              : 'bg-primary text-primary-foreground'
          }`}
        >
          {isConfirming ? 'Confirm Trade' : 'Execute Trade'}
        </button>

        {isConfirming && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <AlertCircle className="w-4 h-4" />
            Click again to confirm your trade
          </div>
        )}
      </div>
    </div>
  )
}

