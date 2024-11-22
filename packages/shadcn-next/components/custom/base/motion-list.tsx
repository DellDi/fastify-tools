'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function MotionHeading({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <motion.h1
      className={cn(
        'text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {text}
    </motion.h1>
  )
}

export function MotionParagraph({
  text,
  className,
}: {
  text: string
  className?: string
}) {
  return (
    <motion.p
      className={cn('mt-4 text-gray-600 dark:text-blue-100', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {text}
    </motion.p>
  )
}

export function MotionButtonGroup({ className }: { className?: string }) {
  return (
    <motion.div
      className={cn('mt-8 flex justify-center space-x-4', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <Link href="/dashboard">
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105">
          开始使用
        </button>
      </Link>
      <Link href="/login">
        <button className="bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-blue-100 px-6 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105">
          中文文档
        </button>
      </Link>
    </motion.div>
  )
}

export function MotionSection({
  title,
  description,
  linkText,
  linkHref,
  gradient,
}: {
  title: string
  description: string
  linkText: string
  linkHref: string
  gradient: string
}) {
  return (
    <motion.div
      className={cn(
        `bg-gradient-to-br ${gradient} text-white shadow-lg p-6 rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105`
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-100">{description}</p>
      <Link href={linkHref} className="text-white mt-4 block hover:underline">
        {linkText} →
      </Link>
    </motion.div>
  )
}
