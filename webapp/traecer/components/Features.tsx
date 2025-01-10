'use client'

import { motion } from 'framer-motion'
import { Activity, Shield, Zap, BarChart3, Lock, Users } from 'lucide-react'

const features = [
  {
    icon: Activity,
    title: "Real-Time Performance Tracking",
    description: "Monitor win rates, profit/loss, and performance metrics for every trader and community in real-time."
  },
  {
    icon: Zap,
    title: "Instant Trade Execution",
    description: "Execute trades instantly with one-click trading across multiple brokerages. No more delays or missed opportunities."
  },
  {
    icon: Shield,
    title: "Verified Communities",
    description: "Join communities with verified track records and transparent performance history."
  },
  {
    icon: BarChart3,
    title: "Automated Trade Logging",
    description: "Every trade is automatically logged and tracked, providing detailed analytics and insights."
  },
  {
    icon: Lock,
    title: "Risk Management",
    description: "Set stop losses and take profits automatically. Protect your capital with advanced risk management tools."
  },
  {
    icon: Users,
    title: "Community Insights",
    description: "Learn from top traders and see their real-time performance before joining their communities."
  }
]

export default function Features() {
  return (
    <section className="py-20 bg-secondary">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">
            Everything you need to trade
            <br />
            <span className="text-primary font-serif italic">with confidence</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-8 font-ui max-w-2xl mx-auto">
            Join verified trading communities and execute trades with precision using our comprehensive platform.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-lg p-6 border border-border hover:border-primary transition-colors"
            >
              <feature.icon className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-display font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground font-ui">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

