'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/utils/utils'

export function MotionHeading({
  text,
  className,
  children,
}: {
  text?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <motion.h1
      className={cn(
        'text-5xl font-bold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-purple-600',
        className
      )}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      {children || text}
    </motion.h1>
  )
}

export function MotionParagraph({
  text,
  className,
  children,
}: {
  text?: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <motion.p
      className={cn('mt-4 text-gray-600 dark:text-blue-100', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      {children || text}
    </motion.p>
  )
}

export function MotionButtonGroup({ 
  className,
  buttons,
}: { 
  className?: string
  buttons?: Array<{
    text: string
    href: string
    variant?: 'default' | 'outline'
  }>
}) {
  const defaultButtons = buttons || [
    {
      text: '开始使用',
      href: '/dashboard',
      variant: 'default',
    },
    {
      text: '中文文档',
      href: '/login',
      variant: 'outline',
    },
  ]

  return (
    <motion.div
      className={cn('mt-8 flex justify-center space-x-4', className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      {defaultButtons.map((button, index) => (
        <Link key={index} href={button.href}>
          <button 
            className={cn(
              'px-6 py-2 rounded-full hover:shadow-lg transition duration-300 transform hover:scale-105',
              button.variant === 'outline' 
                ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-blue-100' 
                : 'bg-linear-to-r from-blue-600 to-purple-600 text-white'
            )}
          >
            {button.text}
          </button>
        </Link>
      ))}
    </motion.div>
  )
}

export function MotionSection({
  title,
  description,
  linkText,
  linkHref,
  gradient,
  className,
  children,
}: {
  title?: string
  description?: string
  linkText?: string
  linkHref?: string
  gradient?: string
  className?: string
  children?: React.ReactNode
}) {
  if (children) {
    return (
      <motion.div
        className={cn(
          'border border-gray-200 dark:border-gray-700 rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-xs hover:shadow-md transition-all duration-300',
          className
        )}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <motion.div
      className={cn(
        `bg-linear-to-br ${gradient} text-white border border-gray-200 dark:border-gray-700 shadow-lg p-6 rounded-lg hover:shadow-xl transition duration-300 transform hover:scale-105 flex flex-col items-center text-center`
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="mt-2 text-gray-100">{description}</p>
      <Link href={linkHref || '#'} className="text-white mt-4 block hover:underline">
        {linkText} →
      </Link>
    </motion.div>
  )
}
