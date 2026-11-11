'use client'

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2, RefreshCw, ScrollText, Trash2 } from 'lucide-react'
import {
  dockerLogs,
  fsApi,
  useDockerContainers,
  useDockerDf,
  useDockerImages,
} from '@/hooks/use-fs'

const fmtSize = (n: number) =>
  n < 1024 ** 2
    ? `${(n / 1024).toFixed(0)} K`
    : n < 1024 ** 3
      ? `${(n / 1024 ** 2).toFixed(1)} M`
      : `${(n / 1024 ** 3).toFixed(2)} G`

const PRUNE_LABEL: Record<PruneType, string> = {
  dangling: '悬空镜像',
  images: '未使用镜像',
  containers: '已停止容器',
  volumes: '未引用卷',
  buildcache: '构建缓存',
}
type PruneType = 'dangling' | 'images' | 'containers' | 'volumes' | 'buildcache'

export function DockerPanel() {
  const [pruneTarget, setPruneTarget] = useState<PruneType | null>(null)
  const [busy, setBusy] = useState(false)
  const [pruning, setPruning] = useState<string | null>(null) // 进行中的清理任务类型
  const [logTarget, setLogTarget] = useState<{ id: string; name: string } | null>(null)
  const df = useDockerDf(true)
  const images = useDockerImages(true)
  const containers = useDockerContainers(true)

  const refreshAll = () => Promise.all([df.mutate(), images.mutate(), containers.mutate()])

  // prune 是后端异步任务（清 GB 级数据要几分钟）：POST 启动后轮询 status
  const doPrune = async () => {
    if (!pruneTarget) return
    const type = pruneTarget
    setBusy(true)
    setPruneTarget(null)
    setPruning(type)
    try {
      await fsApi('/api/docker/prune', { body: { type } })
      const job = await new Promise<{ done?: { reclaimed: number }; error?: string }>(
        (resolve, reject) => {
          const timer = setInterval(async () => {
            try {
              const res = await fsApi<{ job: { done?: { reclaimed: number }; error?: string } | null }>(
                '/api/docker/prune/status',
                { method: 'GET' }
              )
              const j = res.job
              if (j?.done || j?.error) {
                clearInterval(timer)
                resolve(j)
              }
            } catch (e) {
              clearInterval(timer)
              reject(e)
            }
          }, 2000)
        }
      )
      if (job.error) throw new Error(job.error)
      toast.success(`已清理${PRUNE_LABEL[type]}，释放 ${fmtSize(job.done?.reclaimed ?? 0)}`)
      await refreshAll()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '清理失败')
    } finally {
      setPruning(null)
      setBusy(false)
    }
  }

  const delImage = async (id: string) => {
    setBusy(true)
    try {
      await fsApi(`/api/docker/images/${encodeURIComponent(id)}`, { method: 'DELETE' })
      toast.success('镜像已删除')
      await refreshAll()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '删除失败')
    } finally {
      setBusy(false)
    }
  }

  const summaryCards = [
    { title: '镜像', v: df.data?.images, extra: `可回收 ${fmtSize(df.data?.images.reclaimable ?? 0)}` },
    { title: '容器', v: df.data?.containers, extra: `${df.data?.containers.running ?? 0} 运行中` },
    { title: '卷', v: df.data?.volumes, extra: `${df.data?.volumes.count ?? 0} 个` },
    { title: '构建缓存', v: df.data?.buildCache, extra: `${df.data?.buildCache.count ?? 0} 项` },
  ]

  return (
    <div className="flex flex-col gap-4">
      {/* 概览 */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {summaryCards.map((c) => (
          <Card key={c.title}>
            <CardHeader className="pb-1">
              <CardTitle className="text-sm text-muted-foreground">{c.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold tabular-nums">
                {c.v ? fmtSize(c.v.size) : '—'}
              </div>
              <div className="mt-0.5 text-xs text-muted-foreground">{c.extra}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 清理操作 */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">空间清理</CardTitle>
            <Button size="sm" variant="ghost" onClick={() => refreshAll()}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {(Object.keys(PRUNE_LABEL) as PruneType[]).map((t) => (
            <Button
              key={t}
              size="sm"
              variant={t === 'images' || t === 'volumes' ? 'destructive' : 'outline'}
              disabled={busy || !!pruning}
              onClick={() => setPruneTarget(t)}
            >
              {pruning === t ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-4 w-4" />
              )}
              {pruning === t ? '清理中…' : `清理${PRUNE_LABEL[t]}`}
            </Button>
          ))}
          {pruning && (
            <span className="self-center text-xs text-muted-foreground">
              「{PRUNE_LABEL[pruning as PruneType]}」清理中，数据量大可能需要几分钟…
            </span>
          )}
        </CardContent>
      </Card>

      {/* 镜像表 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">镜像（按体积排序）</CardTitle>
        </CardHeader>
        <CardContent className="max-h-72 overflow-auto p-0">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>标签</TableHead>
                <TableHead className="w-28">大小</TableHead>
                <TableHead className="w-40">创建时间</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(images.data?.images ?? []).map((i) => (
                <TableRow key={i.id}>
                  <TableCell className="max-w-0">
                    <div className="flex flex-wrap gap-1">
                      {i.repoTags.length ? (
                        i.repoTags.map((t) => (
                          <Badge key={t} variant="secondary" className="font-mono text-[10px]">
                            {t}
                          </Badge>
                        ))
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">
                          {i.id.slice(7, 19)}（无标签）
                        </span>
                      )}
                      {i.containers > 0 && (
                        <Badge variant="outline" className="text-[10px]">
                          {i.containers} 容器使用
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="tabular-nums">{fmtSize(i.size)}</TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(i.created).toLocaleDateString('zh-CN')}
                  </TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      disabled={busy || i.containers > 0}
                      title={i.containers > 0 ? '被容器引用，不可删' : '删除镜像'}
                      onClick={() => delImage(i.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 容器表 */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">容器</CardTitle>
        </CardHeader>
        <CardContent className="max-h-72 overflow-auto p-0">
          <Table>
            <TableHeader className="sticky top-0 bg-card">
              <TableRow>
                <TableHead>名称</TableHead>
                <TableHead>镜像</TableHead>
                <TableHead className="w-24">状态</TableHead>
                <TableHead className="w-48">详情</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(containers.data?.containers ?? []).map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-mono text-xs">{c.name}</TableCell>
                  <TableCell className="max-w-0 truncate font-mono text-xs">{c.image}</TableCell>
                  <TableCell>
                    <Badge variant={c.state === 'running' ? 'default' : 'secondary'}>
                      {c.state}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{c.status}</TableCell>
                  <TableCell>
                    <Button
                      size="icon"
                      variant="ghost"
                      title="查看日志"
                      onClick={() => setLogTarget({ id: c.id, name: c.name })}
                    >
                      <ScrollText className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* 清理确认 */}
      <AlertDialog open={!!pruneTarget} onOpenChange={(o) => !o && setPruneTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认清理</AlertDialogTitle>
            <AlertDialogDescription>
              {pruneTarget && `将清理所有${PRUNE_LABEL[pruneTarget]}，操作不可恢复。`}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={doPrune}
            >
              {busy ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : null}
              清理
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LogDialog target={logTarget} onClose={() => setLogTarget(null)} />
    </div>
  )
}

// ---------- 容器日志 ----------

function LogDialog({
  target,
  onClose,
}: {
  target: { id: string; name: string } | null
  onClose: () => void
}) {
  const [tail, setTail] = useState(200)
  const [logs, setLogs] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const load = async (id: string, t: number) => {
    setLoading(true)
    try {
      setLogs((await dockerLogs(id, t)).logs || '（无日志输出）')
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '获取日志失败')
      setLogs(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (target) {
      setLogs(null)
      void load(target.id, 200)
    }
    // 仅 target 变化时加载；tail 切换由按钮直接触发 load
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])

  return (
    <Dialog
      open={!!target}
      onOpenChange={(o) => {
        if (!o) {
          setLogs(null)
          onClose()
        }
      }}
    >
      <DialogContent className="flex h-[80vh] max-w-4xl flex-col">
        <DialogHeader>
          <DialogTitle className="font-mono text-sm">容器日志 · {target?.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2">
            尾部
            {[100, 200, 500, 1000].map((t) => (
              <Button
                key={t}
                size="sm"
                variant={tail === t ? 'default' : 'outline'}
                className="h-6 px-2 text-xs"
                onClick={() => {
                  setTail(t)
                  if (target) void load(target.id, t)
                }}
              >
                {t}
              </Button>
            ))}
            行
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2"
              onClick={() => target && void load(target.id, tail)}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </DialogDescription>
        </DialogHeader>
        <div className="min-h-0 flex-1 overflow-auto rounded-md bg-zinc-950 p-3">
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin text-zinc-400" />
          ) : (
            <pre className="font-mono text-xs leading-relaxed whitespace-pre-wrap break-all text-zinc-200">
              {logs}
            </pre>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
