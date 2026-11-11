'use client'

import { useState } from 'react'
import { AlertTriangle, Folder, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { DuNode, useFsDu } from '@/hooks/use-fs'

const fmtSize = (n: number) => {
  if (n < 1024) return `${n} B`
  if (n < 1024 ** 2) return `${(n / 1024).toFixed(1)} K`
  if (n < 1024 ** 3) return `${(n / 1024 ** 2).toFixed(1)} M`
  return `${(n / 1024 ** 3).toFixed(2)} G`
}

const QUICK_ROOTS = ['/', '/opt', '/srv', '/var', '/root', '/home', '/usr', '/etc']

// 拍平 depth 层树 → 按 size 排序的缩进行；点击目录可下钻重算
function flatten(node: DuNode, depth = 0): { node: DuNode; depth: number }[] {
  const rows = [{ node, depth }]
  for (const c of node.children ?? []) rows.push(...flatten(c, depth + 1))
  return rows
}

export function DiskPanel() {
  const [root, setRoot] = useState('/')
  const [input, setInput] = useState('/')
  const { data, isLoading, error } = useFsDu(root, 2)

  const rows = data ? flatten(data.root) : []
  const maxSize = Math.max(...rows.map((r) => r.node.size), 1)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-muted-foreground">分析根目录</span>
        {QUICK_ROOTS.map((r) => (
          <Button
            key={r}
            size="sm"
            variant={root === r ? 'default' : 'outline'}
            className="h-7 px-2 font-mono text-xs"
            onClick={() => {
              setRoot(r)
              setInput(r)
            }}
          >
            {r}
          </Button>
        ))}
        <div className="flex gap-1">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && input.trim() && setRoot(input.trim())}
            className="h-7 w-44 font-mono text-xs"
            placeholder="/自定义路径"
          />
          <Button size="sm" className="h-7" onClick={() => input.trim() && setRoot(input.trim())}>
            分析
          </Button>
        </div>
        {data?.truncated && (
          <Badge variant="outline" className="text-amber-600">
            <AlertTriangle className="mr-1 h-3 w-3" />
            目录过大已截断，建议下钻分析
          </Badge>
        )}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between text-base">
            <span className="font-mono">{root}</span>
            {data && <span className="text-lg tabular-nums">{fmtSize(data.root.size)}</span>}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && (
            <div className="flex items-center justify-center gap-2 py-16 text-muted-foreground">
              <Loader2 className="h-5 w-5 animate-spin" />
              正在扫描目录体积…
            </div>
          )}
          {error && <div className="py-8 text-center text-destructive">{error.message}</div>}
          {data && (
            <div className="space-y-1">
              {rows.slice(1).map(({ node, depth }) => (
                <button
                  key={node.path}
                  className="group flex w-full items-center gap-2 rounded px-2 py-1 text-left hover:bg-muted/60"
                  style={{ paddingLeft: `${depth * 20 + 8}px` }}
                  onClick={() => {
                    setRoot(node.path)
                    setInput(node.path)
                  }}
                  title={`下钻分析 ${node.path}`}
                >
                  <Folder className="h-4 w-4 shrink-0 text-sky-500" />
                  <span className="w-56 shrink-0 truncate font-mono text-xs sm:w-72">
                    {node.name}
                  </span>
                  <div className="relative h-4 min-w-0 flex-1 overflow-hidden rounded bg-muted/60">
                    <div
                      className="h-full rounded bg-sky-500/70 transition-all group-hover:bg-sky-500"
                      style={{ width: `${Math.max((node.size / maxSize) * 100, node.size ? 0.5 : 0)}%` }}
                    />
                  </div>
                  <span className="w-20 shrink-0 text-right text-xs tabular-nums text-muted-foreground">
                    {fmtSize(node.size)}
                  </span>
                </button>
              ))}
              {rows.length === 1 && (
                <div className="py-8 text-center text-sm text-muted-foreground">
                  空目录或无权限读取
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      <p className="text-xs text-muted-foreground">
        说明：不跟随符号链接；跳过 /proc /sys /dev /run；点击目录可下钻（每次扫描展开 2 层）。
      </p>
    </div>
  )
}
