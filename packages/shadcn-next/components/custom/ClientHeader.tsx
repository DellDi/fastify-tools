'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleTheme } from '@/components/custom/ToggleTheme'
import { GithubIcon } from '@/components/custom/base/custom-icon'

const navLinks = [
  { href: '/dashboard', label: '首页' },
  { href: '/login', label: '登录' },
  { href: '#', label: '模型实例' },
  { href: '/changelog/list', label: '更新日志' },
  { href: '/password/newsee', label: '解密' },
  { href: 'https://github.com/DellDi', label: 'GitHub', icon: <GithubIcon className="h-5 w-5"/> },
]

export default function ClientHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header
      className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="https://avatars.githubusercontent.com/u/40460351?v=4" width={32}
                   height={32} alt="Next Full Stack" className="h-8 w-8 rounded-full"/>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              Next Full Stack
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link, index) => (
              <Link
                key={index}
                href={link.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                {link.icon ? (
                  <span className="flex items-center space-x-1">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <ToggleTheme/>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden"
          >
            <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon ? (
                    <span className="flex items-center space-x-2">
                      {link.icon}
                      <span>{link.label}</span>
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
