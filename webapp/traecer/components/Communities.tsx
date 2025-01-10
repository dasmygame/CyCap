'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { ArrowUpRight, Users, TrendingUp } from 'lucide-react'

const communities = [
  {
    name: "Alpha Traders",
    avatar: "/placeholder.svg?height=100&width=100",
    members: "2.5K",
    winRate: "76%",
    monthlyReturn: "+32.5%",
    trades: "1.2K",
    verified: true
  },
  {
    name: "Pro Signal Hub",
    avatar: "/placeholder.svg?height=100&width=100",
    members: "1.8K",
    winRate: "82%",
    monthlyReturn: "+28.7%",
    trades: "950",
    verified: true
  },
  {
    name: "Elite Trading Room",
    avatar: "/placeholder.svg?height=100&width=100",
    members: "3.2K",
    winRate: "71%",
    monthlyReturn: "+41.2%",
    trades: "2.1K",
    verified: true
  }
]

export default function Communities() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Top performing
            <br />
            <span className="text-primary font-serif italic">communities</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-ui max-w-2xl mx-auto">
            Join verified trading communities with proven track records. All performance metrics are tracked and verified in real-time.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {communities.map((community, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 border border-border group hover:border-primary transition-colors"
            >
              <div className="flex items-center gap-4 mb-6">
                <Image
                  src={community.avatar}
                  alt={community.name}
                  width={48}
                  height={48}
                  className="rounded-full"
                />
                <div>
                  <h3 className="text-lg font-display font-bold">{community.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="w-4 h-4" />
                    {community.members} members
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <div className="text-sm text-muted-foreground mb-1 font-ui">Win Rate</div>
                  <div className="text-2xl font-mono">{community.winRate}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 font-ui">Monthly</div>
                  <div className="text-2xl font-mono text-primary">{community.monthlyReturn}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 font-ui">Trades</div>
                  <div className="text-2xl font-mono">{community.trades}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground mb-1 font-ui">Status</div>
                  <div className="text-sm font-display font-bold px-2 py-1 bg-primary/20 text-primary rounded-full inline-flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Verified
                  </div>
                </div>
              </div>

              <button className="w-full bg-card hover:bg-primary text-foreground hover:text-primary-foreground border border-border hover:border-primary rounded-lg px-4 py-3 flex items-center justify-center gap-2 transition-all group font-display font-bold">
                View Community
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

