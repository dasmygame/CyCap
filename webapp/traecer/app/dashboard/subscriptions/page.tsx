'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, MessageSquare, TrendingUp, AlertCircle, Bell, Shield } from 'lucide-react'

const subscriptions = [
  {
    id: 1,
    name: "Alpha Traders Premium",
    price: "$99/month",
    status: "Active",
    nextBilling: "2024-02-15",
    features: [
      "Real-time trade alerts",
      "Live trading sessions",
      "Educational content",
      "Priority support"
    ],
    stats: {
      members: 2500,
      dailySignals: 5,
      winRate: "76%"
    },
    discordUrl: "https://discord.gg/alphatraders"
  },
  // Add more subscriptions...
]

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">
            Active Subscriptions
          </div>
          <div className="text-2xl font-medium">3</div>
          <div className="text-sm text-primary mt-1">All up to date</div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">
            Total Monthly Cost
          </div>
          <div className="text-2xl font-medium">$247</div>
          <div className="text-sm text-muted-foreground mt-1">
            Next billing in 12 days
          </div>
        </div>
        <div className="bg-card p-6 rounded-lg border border-border">
          <div className="text-sm text-muted-foreground mb-2">
            Signal Accuracy
          </div>
          <div className="text-2xl font-medium">82%</div>
          <div className="text-sm text-primary mt-1">+5% this month</div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border">
        <div className="p-6 border-b border-border">
          <h2 className="text-lg font-medium">Active Subscriptions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            {subscriptions.map((sub) => (
              <div
                key={sub.id}
                className="bg-secondary rounded-lg p-6 border border-border"
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">{sub.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Shield className="w-4 h-4" />
                      Verified Provider
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-medium">{sub.price}</div>
                    <div className="text-sm text-muted-foreground">
                      Next billing: {sub.nextBilling}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-card p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Members
                    </div>
                    <div className="text-lg font-medium">
                      {sub.stats.members}
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Daily Signals
                    </div>
                    <div className="text-lg font-medium">
                      {sub.stats.dailySignals}
                    </div>
                  </div>
                  <div className="bg-card p-4 rounded-lg">
                    <div className="text-sm text-muted-foreground mb-1">
                      Win Rate
                    </div>
                    <div className="text-lg font-medium text-primary">
                      {sub.stats.winRate}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-medium">
                    View Discord
                  </button>
                  <button className="flex-1 bg-secondary border border-border hover:bg-secondary/80 py-2 rounded-lg font-medium">
                    Manage Subscription
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

