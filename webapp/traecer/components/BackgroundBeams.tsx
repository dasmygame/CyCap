"use client"

import React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

export const BackgroundBeams = ({ className }: { className?: string }) => {
  const beams = Array(30).fill(null).map((_, i) => ({
    x1: `${Math.random() * 100}%`,
    y1: `${Math.random() * 100}%`,
    x2: `${Math.random() * 100}%`,
    y2: `${Math.random() * 100}%`,
  }))

  return (
    <div className={cn("absolute inset-0 z-0 overflow-hidden", className)}>
      <svg className="absolute w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="beam-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(24, 204, 252, 0.3)" />
            <stop offset="50%" stopColor="rgba(99, 68, 245, 0.3)" />
            <stop offset="100%" stopColor="rgba(174, 72, 255, 0.3)" />
          </linearGradient>
        </defs>
        {beams.map((beam, index) => (
          <motion.line
            key={index}
            x1={beam.x1}
            y1={beam.y1}
            x2={beam.x2}
            y2={beam.y2}
            stroke="url(#beam-gradient)"
            strokeWidth="0.5"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.5 }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </svg>
    </div>
  )
}

