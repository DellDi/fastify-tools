'use client'

import { useCallback, useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Copy, ExternalLink, RefreshCw, Trash2 } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface SiteInfo {
  slug: string
  url: string
  files: number
  sizeBytes: number
  mtime: number
  hasIndexHtml: boolean
}

interface DeployLogEntry {
  ts: string
  action: 'deploy' | 'delete'
  slug: string
  files?: number
  sizeBytes?: number
  ip?: string
  via?: 'http' | 'mcp'
}

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ''

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`
}

export default function PagesAuditPage() {
  const [sites, setSites] = useState<SiteInfo[]>([])
  const [logs, setLogs] = useState<DeployLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<SiteInfo | null>(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`${basePath}/api/pages`)
      const data = await res.json()
      setSites(data.sites || [])
      setLogs(data.logs || [])
    } catch {
      toast({ title: '加载失败', description: '无法获取站点列表', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url)
    toast({ title: '已复制', description: url })
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    try {
      const res = await fetch(`${basePath}/api/pages`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug: deleteTarget.slug }),
      })
      if (!res.ok) throw new Error(await res.text())
      toast({ title: '已删除', description: deleteTarget.slug })
      setDeleteTarget(null)
      fetchData()
    } catch {
      toast({ title: '删除失败', description: deleteTarget.slug, variant: 'destructive' })
    }
  }

  return (
    <div className="container mx-auto py-10 space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Pages 站点</CardTitle>
            <CardDescription>
              已部署的静态站点（*.pages.delldiagi.top），共 {sites.length} 个
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
            刷新
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>站点</TableHead>
                <TableHead>URL</TableHead>
                <TableHead className="text-right">文件数</TableHead>
                <TableHead className="text-right">大小</TableHead>
                <TableHead>更新时间</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sites.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground">
                    暂无站点
                  </TableCell>
                </TableRow>
              )}
              {sites.map((s) => (
                <TableRow key={s.slug}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-medium">{s.slug}</span>
                      {s.hasIndexHtml ? (
                        <Badge variant="secondary" className="text-xs">有首页</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">无 index.html</Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-sm text-blue-600 hover:underline"
                      >
                        {s.url}
                      </a>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => copyUrl(s.url)}>
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{s.files}</TableCell>
                  <TableCell className="text-right">{formatSize(s.sizeBytes)}</TableCell>
                  <TableCell>{formatDate(new Date(s.mtime).toISOString())}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                        <a href={s.url} target="_blank" rel="noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-destructive"
                        onClick={() => setDeleteTarget(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>部署审计</CardTitle>
          <CardDescription>最近 {logs.length} 条部署/删除记录</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>时间</TableHead>
                <TableHead>动作</TableHead>
                <TableHead>站点</TableHead>
                <TableHead className="text-right">文件数</TableHead>
                <TableHead className="text-right">zip 大小</TableHead>
                <TableHead>来源</TableHead>
                <TableHead>IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    暂无记录
                  </TableCell>
                </TableRow>
              )}
              {logs.map((l, i) => (
                <TableRow key={`${l.ts}-${i}`}>
                  <TableCell className="whitespace-nowrap">{formatDate(l.ts)}</TableCell>
                  <TableCell>
                    {l.action === 'deploy' ? (
                      <Badge variant="secondary" className="text-xs">部署</Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">删除</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-mono">{l.slug}</TableCell>
                  <TableCell className="text-right">{l.files ?? '-'}</TableCell>
                  <TableCell className="text-right">
                    {l.sizeBytes != null ? formatSize(l.sizeBytes) : '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">{l.via || '-'}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{l.ip || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>删除站点 {deleteTarget?.slug}？</AlertDialogTitle>
            <AlertDialogDescription>
              将删除 {deleteTarget?.url} 对应的全部文件，操作不可恢复。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>删除</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
