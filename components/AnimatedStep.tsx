'use client'

import { motion } from 'framer-motion';

interface AnimatedStepProps {
  index: number;
  title: string;
  description: string;
  delay: number;
}

export default function AnimatedStep({ index, title, description, delay }: AnimatedStepProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: delay,
        ease: [0.21, 1.11, 0.81, 0.99],
      }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      className="flex flex-col items-center p-6 bg-card text-card-foreground shadow-md rounded-lg hover:shadow-lg transition-shadow"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: delay + 0.2,
          type: "spring",
          stiffness: 260,
          damping: 20
        }}
        className="mb-6 bg-primary text-primary-foreground w-12 h-12 flex items-center justify-center text-xl rounded-full"
      >
        {index + 1}
      </motion.div>
      <motion.h3
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: delay + 0.3,
        }}
        className="mb-2 text-xl font-semibold"
      >
        {title}
      </motion.h3>
      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{
          duration: 0.5,
          delay: delay + 0.4,
        }}
        className="text-muted-foreground text-center"
      >
        {description}
      </motion.p>
    </motion.div>
  );
} 