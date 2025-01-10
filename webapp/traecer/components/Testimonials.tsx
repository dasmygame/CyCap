'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const testimonials = [
  {
    avatar: "/avatar1.jpg",
    name: "Michael S.",
    joinDate: "Joined 6 months ago",
    content: "CYCAP completely transformed my trading journey. The live sessions and real-time alerts have helped me achieve consistent profits I never thought possible.",
    profit: "+$32,451",
    date: "Last month"
  },
  {
    avatar: "/avatar2.jpg",
    name: "Sarah L.",
    joinDate: "Joined 1 year ago",
    content: "The community support and education here is unmatched. I've learned more in 3 months with CYCAP than I did in 2 years of trading on my own.",
    profit: "+$12,847",
    date: "Last month"
  },
  {
    avatar: "/avatar3.jpg",
    name: "David R.",
    joinDate: "Joined 3 months ago",
    content: "The mentorship program is worth every penny. My win rate has increased dramatically since joining CYCAP.",
    profit: "+$28,965",
    date: "Last month"
  }
]

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="testimonials" className="py-20 bg-secondary">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">
            What Our Members Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-ui">
            Join thousands of successful traders who have transformed their trading with CYCAP
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <div className="flex items-start gap-6">
                <Image
                  src={testimonials[activeIndex].avatar}
                  alt={testimonials[activeIndex].name}
                  width={80}
                  height={80}
                  className="rounded-full"
                />
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-display font-bold">{testimonials[activeIndex].name}</h3>
                      <p className="text-primary font-serif italic">{testimonials[activeIndex].joinDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-primary font-mono text-xl">{testimonials[activeIndex].profit}</p>
                      <p className="text-muted-foreground text-sm font-ui">{testimonials[activeIndex].date}</p>
                    </div>
                  </div>
                  <p className="text-lg text-muted-foreground font-ui">{testimonials[activeIndex].content}</p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeIndex ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

