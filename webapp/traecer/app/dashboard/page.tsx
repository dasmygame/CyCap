'use client'

import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Users, TrendingUp, TrendingDown, Target, Shield, Activity } from 'lucide-react'

const communityPerformance = [
  { time: '9:30', value: 4000, pnl: 2500 },
  { time: '10:00', value: 3000, pnl: 3200 },
  { time: '10:30', value: 5000, pnl: 4100 },
  { time: '11:00', value: 4500, pnl: 3800 },
  { time: '11:30', value: 6000, pnl: 5200 },
  { time: '12:00', value: 5500, pnl: 4800 },
]

const topCommunities = [
  { 
    name: 'Alpha Traders',
    members: '2.5K',
    winRate: '76%',
    monthlyReturn: '+32.5%',
    verified: true
  },
  { 
    name: 'Pro Signal Hub',
    members: '1.8K',
    winRate: '82%',
    monthlyReturn: '+28.7%',
    verified: true
  },
  { 
    name: 'Elite Trading Room',
    members: '3.2K',
    winRate: '71%',
    monthlyReturn: '+41.2%',
    verified: true
  }
]

const activeSignals = [
  {
    symbol: 'AAPL',
    type: 'LONG',
    entry: '175.50',
    sl: '172.30',
    tp: '180.00',
    community: 'Alpha Traders',
    time: '5m ago'
  },
  {
    symbol: 'NVDA',
    type: 'SHORT',
    entry: '485.20',
    sl: '489.50',
    tp: '475.00',
    community: 'Pro Signal Hub',
    time: '12m ago'
  },
  {
    symbol: 'TSLA',
    type: 'LONG',
    entry: '238.40',
    sl: '235.60',
    tp: '245.00',
    community: 'Elite Trading Room',
    time: '18m ago'
  }
]

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Active Communities', value: '156', icon: Users, change: '+12%' },
          { label: 'Win Rate', value: '76%', icon: Target, change: '+2.4%' },
          { label: 'Verified Traders', value: '2.5K', icon: Shield, change: '+15%' },
          { label: 'Monthly Volume', value: '$12.4M', icon: Activity, change: '+8.7%' }
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <stat.icon className="text-muted-foreground" size={20} />
              <span className="text-[#00FF7F] text-xs font-mono">{stat.change}</span>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm text-muted-foreground font-medium">{stat.label}</h3>
              <p className="text-2xl font-mono tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Community Performance Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-card border border-border"
        >
          <div className="p-6">
            <h2 className="text-lg font-light tracking-tight mb-6">Community Performance</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={communityPerformance}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="time" 
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
                    dataKey="pnl"
                    stroke="#00FF7F"
                    strokeWidth={1.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Top Communities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card border border-border"
        >
          <div className="p-6">
            <h2 className="text-lg font-light tracking-tight mb-6">Top Communities</h2>
            <div className="space-y-4">
              {topCommunities.map((community) => (
                <div
                  key={community.name}
                  className="p-4 bg-background border border-border hover:border-muted transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{community.name}</span>
                    <Shield className="h-4 w-4 text-[#00FF7F]" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Members</p>
                      <p className="font-mono text-sm">{community.members}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Win Rate</p>
                      <p className="font-mono text-sm">{community.winRate}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Monthly</p>
                      <p className="font-mono text-sm text-[#00FF7F]">{community.monthlyReturn}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Active Signals */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-card border border-border"
      >
        <div className="p-6">
          <h2 className="text-lg font-light tracking-tight mb-6">Active Signals</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left pb-4 text-xs font-medium text-muted-foreground">SYMBOL</th>
                  <th className="text-left pb-4 text-xs font-medium text-muted-foreground">TYPE</th>
                  <th className="text-right pb-4 text-xs font-medium text-muted-foreground">ENTRY</th>
                  <th className="text-right pb-4 text-xs font-medium text-muted-foreground">SL</th>
                  <th className="text-right pb-4 text-xs font-medium text-muted-foreground">TP</th>
                  <th className="text-left pb-4 text-xs font-medium text-muted-foreground">COMMUNITY</th>
                  <th className="text-right pb-4 text-xs font-medium text-muted-foreground">TIME</th>
                </tr>
              </thead>
              <tbody className="font-mono">
                {activeSignals.map((signal, index) => (
                  <tr key={index} className="border-b border-border">
                    <td className="py-4 text-sm">{signal.symbol}</td>
                    <td className={`py-4 text-sm ${
                      signal.type === 'LONG' ? 'text-[#00FF7F]' : 'text-red-500'
                    }`}>{signal.type}</td>
                    <td className="py-4 text-sm text-right">${signal.entry}</td>
                    <td className="py-4 text-sm text-right text-red-500">${signal.sl}</td>
                    <td className="py-4 text-sm text-right text-[#00FF7F]">${signal.tp}</td>
                    <td className="py-4 text-sm">{signal.community}</td>
                    <td className="py-4 text-sm text-right text-muted-foreground">{signal.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

