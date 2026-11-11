'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { createPermission, deletePermission, listPermissions } from '@/app/actions/rbac-actions'

type Permission = Awaited<ReturnType<typeof listPermissions>>[number]

export function PermissionsTab() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', groupName: '' })

  const reload = useCallback(async () => {
    try {
      setPermissions(await listPermissions())
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const groups = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    ;(acc[p.groupName || '未分组'] ??= []).push(p)
    return acc
  }, {})

  const create = async () => {
    setBusy(true)
    try {
      await createPermission({
        name: form.name,
        description: form.description || undefined,
        groupName: form.groupName || undefined,
      })
      toast.success('已创建')
      setForm({ name: '', description: '', groupName: '' })
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '创建失败')
    } finally {
      setBusy(false)
    }
  }

  const del = async (p: Permission) => {
    setBusy(true)
    try {
      await deletePermission(p.id)
      toast.success(`已删除 ${p.name}`)
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '删除失败')
    } finally {
      setBusy(false)
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        加载中…
      </div>
    )

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">新建权限</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end gap-2">
          <Input
            className="w-56"
            placeholder="权限名，如 jira:create"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            className="w-48"
            placeholder="描述"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            className="w-36"
            placeholder="分组名（可空）"
            value={form.groupName}
            onChange={(e) => setForm({ ...form, groupName: e.target.value })}
          />
          <Button size="sm" disabled={busy || !form.name.trim()} onClick={create}>
            <Plus className="mr-1 h-4 w-4" />
            创建
          </Button>
        </CardContent>
      </Card>

      {Object.entries(groups).map(([g, ps]) => (
        <Card key={g}>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              {g}
              <Badge variant="secondary">{ps.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="pl-6">权限名</TableHead>
                  <TableHead>描述</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {ps.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell className="pl-6 font-mono text-xs">{p.name}</TableCell>
                    <TableCell className="text-muted-foreground">{p.description || '—'}</TableCell>
                    <TableCell>
                      <Button size="icon" variant="ghost" disabled={busy} onClick={() => del(p)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
