'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { BackgroundBeams } from '@/components/BackgroundBeams'

export default function Hero() {
  return (
    <section className="relative pt-20 pb-20 md:pt-32 md:pb-32 overflow-hidden">
      <BackgroundBeams className="opacity-20" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col lg:flex-row items-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <h1 className="mb-6">
              <span className="font-display text-6xl md:text-8xl font-extrabold block mb-2 tracking-tight">
                trade
              </span>
              <span className="font-serif text-4xl md:text-5xl block mb-2">
                with the best
              </span>
              <span className="font-display text-7xl md:text-9xl font-black tracking-tighter text-gradient">
                win together
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-lg font-ui leading-relaxed">
              Join <span className="font-serif italic">verified</span> trading communities. 
              Execute trades <span className="font-display font-bold">instantly</span>. 
              Track performance in <span className="font-mono">real-time</span>.
            </p>
            <div className="flex space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 font-display text-sm font-bold uppercase tracking-wider transition-colors sharp-edge hover-lift"
              >
                Start Trading
              </motion.button>
              <Link href="/login">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 font-serif text-sm italic transition-colors sharp-edge hover-lift"
                >
                  Sign In →
                </motion.button>
              </Link>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:w-1/2 relative"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden">
              <Image
                src="/placeholder.svg?height=800&width=1000"
                alt="Trading Platform Interface"
                width={1000}
                height={800}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

