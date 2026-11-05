'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { ArrowRight, FileSpreadsheet, MessageSquare } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GithubIcon } from '@/components/custom/base/custom-icon'

const ease = [0.22, 1, 0.36, 1] as const

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease, delay: 0.08 * i },
  }),
}

export function BrandHero() {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

  return (
    <section className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_75%_15%,hsl(var(--primary)/0.10),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(40%_35%_at_10%_90%,hsl(var(--primary)/0.06),transparent_70%)]" />

      <div className="container relative mx-auto grid max-w-6xl items-center gap-14 px-4 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-28">
        <div className="flex flex-col items-start">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={0}
            className="inline-flex items-center gap-2 rounded-full border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-card"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            DellDi · Personal Toolbench
          </motion.div>

          <motion.h1
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={1}
            className="mt-6 text-5xl font-semibold leading-[1.08] tracking-tight text-foreground sm:text-6xl"
          >
            一个顺手的
            <br />
            <span className="font-display italic text-primary">个人工作台</span>
          </motion.h1>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground"
          >
            Jira 协作、AI 对话、文件传输与团队管理——由 DellDi
            设计并维护的一站式工具平台。
          </motion.p>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/dashboard">
                进入工作台
                <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-6">
              <Link href="https://github.com/DellDi" target="_blank">
                <GithubIcon className="h-4 w-4" />
                GitHub
              </Link>
            </Button>
          </motion.div>

          <motion.p
            variants={fadeUp}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-10 font-mono text-xs tracking-wide text-muted-foreground/80"
          >
            Next.js 15 · Fastify 5 · Prisma 6 · PostgreSQL 17
          </motion.p>
        </div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="grid gap-4"
        >
          <div className="rounded-2xl border bg-card p-3 shadow-lift">
            <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br from-[#fbf3ea] via-[#f6e5d4] to-[#ecd6c2]">
              <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_30%_20%,rgba(255,255,255,0.65),transparent_70%)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Image
                  src={`${basePath}/img/delldi-logo.png`}
                  width={112}
                  height={112}
                  alt="DellDi"
                  className="h-28 w-28 rounded-full shadow-lift"
                />
              </div>
              <span className="absolute bottom-3 left-4 font-display text-sm italic text-[#8a5a40]">
                — DellDi
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <MessageSquare className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium">AI 对话</span>
                <span className="ml-auto h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
              </div>
              <div className="mt-3 space-y-2">
                <p className="w-fit max-w-full rounded-lg rounded-tl-sm bg-muted px-2.5 py-1.5 text-[11px] leading-snug text-foreground">
                  整理本周的 Jira 进展
                </p>
                <p className="ml-auto w-4/5 rounded-lg rounded-tr-sm bg-primary/12 px-2.5 py-1.5 text-[11px] leading-snug text-foreground">
                  本周共关闭 12 个工单，3 个待评审…
                </p>
              </div>
            </div>

            <div className="rounded-2xl border bg-card p-4 shadow-card">
              <div className="flex items-center gap-2">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                  <FileSpreadsheet className="h-3.5 w-3.5" />
                </span>
                <span className="text-xs font-medium">文件传输</span>
              </div>
              <div className="mt-3">
                <p className="truncate text-[11px] text-muted-foreground">
                  sprint-24-export.xlsx
                </p>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                  <motion.div
                    initial={{ width: '12%' }}
                    animate={{ width: '78%' }}
                    transition={{ duration: 1.2, ease, delay: 0.9 }}
                    className="h-full rounded-full bg-primary"
                  />
                </div>
                <p className="mt-1.5 text-[11px] font-medium text-foreground">
                  1.2 MB · 78%
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
