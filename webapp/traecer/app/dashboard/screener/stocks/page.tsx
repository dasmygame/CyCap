'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MarketOverview } from '@/components/MarketOverview'
import { StockScreener } from '@/components/StockScreener'
import { AdvancedCharts } from '@/components/AdvancedCharts'
import { EconomicIndicators } from '@/components/EconomicIndicators'
import { NewsAndSentiment } from '@/components/NewsAndSentiment'

const tabs = [
  { id: 'screener', label: 'Stock Screener' },
  { id: 'charts', label: 'Advanced Charts' },
  { id: 'economic', label: 'Economic Indicators' },
  { id: 'news', label: 'News & Sentiment' },
]

export default function StockScreenerPage() {
  const [searchFocused, setSearchFocused] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container py-3">
          <div className="flex items-center justify-between gap-4">
            <div className={`relative flex-1 max-w-md transition-all duration-200 ${
              searchFocused ? 'max-w-2xl' : ''
            }`}>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search stocks, ETFs, or indices..."
                className="w-full bg-muted/50 pl-10 pr-4 py-2 rounded-full text-sm border border-border/50 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="hidden md:inline">Market Status:</span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                Open
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-6 space-y-6">
        {/* Market Overview */}
        <MarketOverview />

        {/* Tabs Navigation */}
        <Tabs defaultValue="screener" className="w-full">
          <div className="border-b border-border/40 mb-6">
            <TabsList className="w-full justify-start rounded-none border-b border-border/40 bg-transparent p-0">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative h-10 rounded-none border-b-2 border-transparent bg-transparent px-4 pb-3 pt-2 font-medium text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-foreground data-[state=active]:shadow-none"
                  
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="screener">
            <StockScreener />
          </TabsContent>

          <TabsContent value="charts">
            <AdvancedCharts />
          </TabsContent>

          <TabsContent value="economic">
            <EconomicIndicators />
          </TabsContent>

          <TabsContent value="news">
            <NewsAndSentiment />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

