'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'motion/react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ToggleTheme } from '@/components/custom/ToggleTheme'
import { GithubIcon } from '@/components/custom/base/custom-icon'
import { ChangelogDialog } from '@/components/custom/changelog-dialog'
import type { ChangelogEntry } from '@/components/custom/changelog-timeline'

const navLinks = [
  { href: '/dashboard', label: '首页' },
  { href: '/login', label: '登录' },
  { href: '/aigc/model', label: '模型调优' },
  { href: '/password/newsee', label: '解密' },
  {
    href: 'https://github.com/DellDi',
    label: 'GitHub',
    icon: <GithubIcon className="h-5 w-5 rounded-full ring-1 ring-border" />,
  },
]

const linkClass =
  'relative text-sm font-medium text-muted-foreground transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full'

export default function ClientHeader({
  changelog = [],
}: {
  changelog?: ChangelogEntry[]
}) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  const [menuOpen, setMenuOpen] = useState(false)
  const [changelogOpen, setChangelogOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/70 backdrop-blur-md">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <Image
              src={`${basePath}/img/delldi-logo.png`}
              width={30}
              height={30}
              alt="Next Full Stack"
              className="h-8 w-8 rounded-full"
            />
            <span className="text-lg font-semibold tracking-tight">
              DellDi
              <span className="text-primary">.</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {navLinks.map((link, index) => (
              <Link key={index} href={link.href} className={linkClass}>
                {link.icon ? (
                  <span className="flex items-center gap-1.5">
                    {link.icon}
                    <span>{link.label}</span>
                  </span>
                ) : (
                  link.label
                )}
              </Link>
            ))}
            <ChangelogDialog
              items={changelog}
              triggerClassName={linkClass}
              open={changelogOpen}
              onOpenChange={setChangelogOpen}
            />
          </nav>

          <div className="flex items-center gap-2">
            <ToggleTheme />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
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
            className="border-t border-border bg-background md:hidden"
          >
            <nav className="container mx-auto flex flex-col gap-1 px-4 py-3">
              {navLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.icon ? (
                    <span className="flex items-center gap-2">
                      {link.icon}
                      <span>{link.label}</span>
                    </span>
                  ) : (
                    link.label
                  )}
                </Link>
              ))}
              <button
                className="rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                onClick={() => {
                  setMenuOpen(false)
                  setChangelogOpen(true)
                }}
              >
                更新日志
              </button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
