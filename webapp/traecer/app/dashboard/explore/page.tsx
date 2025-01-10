'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

const communities = [
  {
    id: 1,
    name: "Alpha Traders",
    description: "Expert stock analysis and real-time trade alerts",
    members: 2500,
    winRate: "76%",
    monthlyReturn: "+32.5%",
    price: "$99/month",
    growthData: [
      { month: 'Jan', members: 1200 },
      { month: 'Feb', members: 1500 },
      { month: 'Mar', members: 1800 },
      { month: 'Apr', members: 2000 },
      { month: 'May', members: 2200 },
      { month: 'Jun', members: 2500 }
    ]
  },
  {
    id: 2,
    name: "Crypto Wolves",
    description: "24/7 cryptocurrency trading signals and analysis",
    members: 3800,
    winRate: "71%",
    monthlyReturn: "+28.7%",
    price: "$129/month",
    growthData: [
      { month: 'Jan', members: 2000 },
      { month: 'Feb', members: 2400 },
      { month: 'Mar', members: 2800 },
      { month: 'Apr', members: 3200 },
      { month: 'May', members: 3500 },
      { month: 'Jun', members: 3800 }
    ]
  },
  {
    id: 3,
    name: "Options Masters",
    description: "Advanced options strategies for consistent profits",
    members: 1500,
    winRate: "82%",
    monthlyReturn: "+41.2%",
    price: "$149/month",
    growthData: [
      { month: 'Jan', members: 800 },
      { month: 'Feb', members: 1000 },
      { month: 'Mar', members: 1100 },
      { month: 'Apr', members: 1300 },
      { month: 'May', members: 1400 },
      { month: 'Jun', members: 1500 }
    ]
  },
  {
    id: 4,
    name: "Forex Titans",
    description: "Global currency pair analysis and trading signals",
    members: 2200,
    winRate: "74%",
    monthlyReturn: "+22.8%",
    price: "$89/month",
    growthData: [
      { month: 'Jan', members: 1000 },
      { month: 'Feb', members: 1300 },
      { month: 'Mar', members: 1600 },
      { month: 'Apr', members: 1800 },
      { month: 'May', members: 2000 },
      { month: 'Jun', members: 2200 }
    ]
  }
]

function CommunityGrowthChart({ data }: { data: typeof communities[0]['growthData'] }) {
  return (
    <div className="h-[200px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="month" 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#171717',
              border: '1px solid #262626',
              borderRadius: '4px',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value} members`]}
          />
          <Line
            type="monotone"
            dataKey="members"
            stroke="#00FF7F"
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default function ExplorePage() {
  const [hoveredCommunity, setHoveredCommunity] = useState<number | null>(null)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-6">Explore Investing Groups</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {communities.map((community) => (
          <motion.div
            key={community.id}
            className="bg-card rounded-lg border border-border overflow-hidden"
            whileHover={{ scale: 1.02 }}
            onHoverStart={() => setHoveredCommunity(community.id)}
            onHoverEnd={() => setHoveredCommunity(null)}
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold mb-2">{community.name}</h2>
                  <p className="text-sm text-muted-foreground">{community.description}</p>
                </div>
                <div className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                  {community.price}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Members</div>
                  <div className="text-lg font-medium">{community.members}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Win Rate</div>
                  <div className="text-lg font-medium">{community.winRate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1">Monthly Return</div>
                  <div className="text-lg font-medium text-primary">{community.monthlyReturn}</div>
                </div>
              </div>
              <div className="mb-4">
                <div className="text-sm text-muted-foreground mb-2">Community Growth</div>
                <CommunityGrowthChart data={community.growthData} />
              </div>
            </div>
            <Link 
              href={`/dashboard/explore/${community.id}`}
              className="block bg-secondary p-4 text-center hover:bg-secondary/80 transition-colors"
            >
              View Community <ArrowRight className="inline-block ml-2" size={16} />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

