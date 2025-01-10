'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { TradingViewWidget } from '../../components/TradingViewWidget'
import { DiscordWidget } from '../../components/DiscordWidget'
import { Users, Star, TrendingUp, MessageSquare, DollarSign, ArrowRight, Shield, Award } from 'lucide-react'

// This would typically come from an API call
const getCommunityData = (id: string) => ({
  id: parseInt(id),
  name: "Alpha Traders",
  description: "Expert stock analysis and real-time trade alerts for serious traders looking to maximize their profits in the stock market.",
  members: 2500,
  winRate: "76%",
  monthlyReturn: "+32.5%",
  price: "$99/month",
  topStock: "AAPL",
  discordUrl: "https://discord.gg/alphatraders",
  leaderboard: [
    { rank: 1, name: "John Doe", return: "+45.2%", winRate: "82%" },
    { rank: 2, name: "Jane Smith", return: "+38.7%", winRate: "79%" },
    { rank: 3, name: "Bob Johnson", return: "+36.1%", winRate: "77%" },
  ],
  recentSignals: [
    { symbol: "AAPL", type: "BUY", price: "$150.25", time: "2 hours ago" },
    { symbol: "TSLA", type: "SELL", price: "$280.50", time: "5 hours ago" },
    { symbol: "AMZN", type: "BUY", price: "$135.75", time: "1 day ago" },
  ],
  features: [
    "Real-time trade alerts",
    "Daily market analysis",
    "Weekly live trading sessions",
    "Educational webinars",
    "Private Discord community",
    "1-on-1 mentoring (Premium tier)",
  ]
})

export default function CommunityPage() {
  const params = useParams()
  const [community, setCommunity] = useState<any>(null)

  useEffect(() => {
    if (params.id) {
      const communityData = getCommunityData(params.id as string)
      setCommunity(communityData)
    }
  }, [params.id])

  if (!community) return <div>Loading...</div>

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{community.name}</h1>
            <p className="text-muted-foreground">{community.description}</p>
          </div>
          <div className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-lg font-bold">
            {community.price}
          </div>
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-secondary p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Members</div>
            <div className="text-2xl font-bold">{community.members}</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
            <div className="text-2xl font-bold">{community.winRate}</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Monthly Return</div>
            <div className="text-2xl font-bold text-primary">{community.monthlyReturn}</div>
          </div>
          <div className="bg-secondary p-4 rounded-lg">
            <div className="text-sm text-muted-foreground mb-1">Top Performer</div>
            <div className="text-2xl font-bold">+45.2%</div>
          </div>
        </div>
        <button className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold text-lg">
          Join Community
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">Performance Chart</h2>
          </div>
          <div className="h-[400px]">
            <TradingViewWidget 
              symbol={community.topStock}
              theme="dark"
              style="1"
            />
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">Community Chat</h2>
          </div>
          <div className="h-[400px]">
            <DiscordWidget serverId={community.discordUrl} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">Leaderboard</h2>
          </div>
          <div className="p-4">
            <table className="w-full">
              <thead>
                <tr className="text-left text-muted-foreground">
                  <th className="pb-2">Rank</th>
                  <th className="pb-2">Trader</th>
                  <th className="pb-2">Return</th>
                  <th className="pb-2">Win Rate</th>
                </tr>
              </thead>
              <tbody>
                {community.leaderboard.map((trader: any) => (
                  <tr key={trader.rank} className="border-t border-border">
                    <td className="py-2">{trader.rank}</td>
                    <td className="py-2">{trader.name}</td>
                    <td className="py-2 text-primary">{trader.return}</td>
                    <td className="py-2">{trader.winRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="p-4 border-b border-border">
            <h2 className="text-xl font-bold">Recent Signals</h2>
          </div>
          <div className="p-4">
            {community.recentSignals.map((signal: any, index: number) => (
              <div key={index} className="flex justify-between items-center py-2 border-t border-border">
                <div>
                  <div className="font-bold">{signal.symbol}</div>
                  <div className="text-sm text-muted-foreground">{signal.time}</div>
                </div>
                <div>
                  <div className={signal.type === 'BUY' ? 'text-primary' : 'text-red-500'}>
                    {signal.type} @ {signal.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="p-4 border-b border-border">
          <h2 className="text-xl font-bold">Community Features</h2>
        </div>
        <div className="p-4">
          <ul className="grid grid-cols-2 gap-4">
            {community.features.map((feature: string, index: number) => (
              <li key={index} className="flex items-center">
                <Shield className="text-primary mr-2" size={16} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

