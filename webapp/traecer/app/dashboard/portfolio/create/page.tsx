'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, X } from 'lucide-react'

export default function CreatePortfolioPage() {
  const [portfolioName, setPortfolioName] = useState('')
  const [assets, setAssets] = useState<{ symbol: string; allocation: number }[]>([])

  const addAsset = () => {
    setAssets([...assets, { symbol: '', allocation: 0 }])
  }

  const removeAsset = (index: number) => {
    setAssets(assets.filter((_, i) => i !== index))
  }

  const updateAsset = (index: number, field: 'symbol' | 'allocation', value: string | number) => {
    const newAssets = [...assets]
    newAssets[index][field] = value as never
    setAssets(newAssets)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send this data to your backend
    console.log('Portfolio created:', { name: portfolioName, assets })
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Portfolio</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="portfolioName" className="block text-sm font-medium text-gray-300 mb-2">
            Portfolio Name
          </label>
          <input
            type="text"
            id="portfolioName"
            value={portfolioName}
            onChange={(e) => setPortfolioName(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Assets</h2>
          {assets.map((asset, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center space-x-4 mb-4"
            >
              <input
                type="text"
                placeholder="Symbol"
                value={asset.symbol}
                onChange={(e) => updateAsset(index, 'symbol', e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <input
                type="number"
                placeholder="Allocation %"
                value={asset.allocation}
                onChange={(e) => updateAsset(index, 'allocation', parseFloat(e.target.value))}
                className="w-24 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
              <button
                type="button"
                onClick={() => removeAsset(index)}
                className="p-2 bg-red-600 rounded-md hover:bg-red-700 transition-colors"
              >
                <X size={16} />
              </button>
            </motion.div>
          ))}
          <button
            type="button"
            onClick={addAsset}
            className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
          >
            <Plus size={16} />
            <span>Add Asset</span>
          </button>
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground py-2 rounded-md hover:bg-primary/90 transition-colors"
        >
          Create Portfolio
        </button>
      </form>
    </div>
  )
}

