'use client'

import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'

interface SectionCardProps {
  id: string | number | bigint
  title: string
  description: string
  linkText: string
  linkHref: string
}

export function SectionCard({ id, title, description, linkText, linkHref }: SectionCardProps) {
  return (
    <motion.div
      key={id.toString()}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all duration-300"
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 0.9, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
      />

      <div className="relative p-6 z-10">
        <motion.h3
          className="text-xl font-semibold mb-3 text-foreground"
          whileHover={{ x: 5 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-muted-foreground mb-6 leading-relaxed min-h-20"
          initial={{ opacity: 0.9 }}
          whileHover={{ opacity: 1 }}
        >
          {description}
        </motion.p>

        <div className="flex">
          <motion.a
            href={linkHref}
            className="inline-flex items-center text-sm font-medium text-primary group-hover:text-primary/80 transition-colors"
            whileHover={{ x: 3 }}
          >
            {linkText}
            <motion.span
              initial={{ x: 0 }}
              whileHover={{ x: 3 }}
              transition={{ type: 'spring', stiffness: 500 }}
            >
              <ChevronRight className="ml-1 h-4 w-4" />
            </motion.span>
          </motion.a>
        </div>
      </div>
    </motion.div>
  )
}
