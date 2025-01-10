'use client'

import { motion } from 'framer-motion'
import { Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart"

const performanceData = [
  { month: 'Jan', return: 12 },
  { month: 'Feb', return: 19 },
  { month: 'Mar', return: 15 },
  { month: 'Apr', return: 25 },
  { month: 'May', return: 32 },
  { month: 'Jun', return: 28 },
  { month: 'Jul', return: 35 },
]

export default function Performance() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Track Your <span className="text-primary font-serif italic">Performance</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-ui">
            Monitor your trading performance with detailed analytics and insights.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 bg-card rounded-xl p-6 border border-border"
          >
            <h3 className="text-xl font-display font-bold mb-6">Performance Overview</h3>
            <div className="h-[400px]">
              <ChartContainer
                config={{
                  return: {
                    label: "Monthly Return",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
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
                      tickFormatter={(value) => `${value}%`}
                    />
                    <Line
                      type="monotone"
                      dataKey="return"
                      stroke="hsl(var(--chart-1))"
                      strokeWidth={2}
                    />
                    <Tooltip content={<ChartTooltipContent />} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-display font-bold mb-4">Monthly Stats</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground font-ui">Win Rate</div>
                  <div className="text-2xl font-mono font-bold">78%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-ui">Profit Factor</div>
                  <div className="text-2xl font-mono font-bold">2.5</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-ui">Total Trades</div>
                  <div className="text-2xl font-mono font-bold">156</div>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border">
              <h3 className="text-xl font-display font-bold mb-4">Risk Metrics</h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-muted-foreground font-ui">Max Drawdown</div>
                  <div className="text-2xl font-mono font-bold">12.5%</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground font-ui">Sharpe Ratio</div>
                  <div className="text-2xl font-mono font-bold">1.8</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

