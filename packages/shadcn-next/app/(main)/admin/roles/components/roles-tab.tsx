'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { KeyRound, Loader2, Pencil, Plus, ScrollText, Trash2 } from 'lucide-react'
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
import { Checkbox } from '@/components/ui/checkbox'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  createRole,
  deleteRole,
  listMenus,
  listPermissions,
  listRoles,
  setRoleMenus,
  setRolePermissions,
  updateRole,
} from '@/app/actions/rbac-actions'

type Role = Awaited<ReturnType<typeof listRoles>>[number]
type Permission = Awaited<ReturnType<typeof listPermissions>>[number]
type Menu = Awaited<ReturnType<typeof listMenus>>[number]

export function RolesTab() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [menus, setMenus] = useState<Menu[]>([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [editTarget, setEditTarget] = useState<Role | 'new' | null>(null)
  const [permTarget, setPermTarget] = useState<Role | null>(null)
  const [menuTarget, setMenuTarget] = useState<Role | null>(null)
  const [delTarget, setDelTarget] = useState<Role | null>(null)
  const [form, setForm] = useState({ name: '', description: '' })
  const [checked, setChecked] = useState<Set<string>>(new Set())

  const reload = useCallback(async () => {
    try {
      const [r, p, m] = await Promise.all([listRoles(), listPermissions(), listMenus()])
      setRoles(r)
      setPermissions(p)
      setMenus(m)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const run = async (fn: () => Promise<unknown>, ok: string) => {
    setBusy(true)
    try {
      await fn()
      toast.success(ok)
      setEditTarget(null)
      setPermTarget(null)
      setMenuTarget(null)
      setDelTarget(null)
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '操作失败')
    } finally {
      setBusy(false)
    }
  }

  const permGroups = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    ;(acc[p.groupName || '未分组'] ??= []).push(p)
    return acc
  }, {})

  const menuTree = (parentId: string | null): Menu[] =>
    menus.filter((m) => m.parentId === parentId)

  const openPerm = (r: Role) => {
    setChecked(new Set(r.rolePermissions.map((rp) => rp.permissionId)))
    setPermTarget(r)
  }
  const openMenu = (r: Role) => {
    setChecked(new Set(r.roleMenus.map((rm) => rm.menuId)))
    setMenuTarget(r)
  }
  const toggle = (id: string) =>
    setChecked((s) => {
      const n = new Set(s)
      if (n.has(id)) {
        n.delete(id)
      } else {
        n.add(id)
      }
      return n
    })

  if (loading)
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        加载中…
      </div>
    )

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => {
            setForm({ name: '', description: '' })
            setEditTarget('new')
          }}
        >
          <Plus className="mr-1 h-4 w-4" />
          新建角色
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>角色</TableHead>
              <TableHead>描述</TableHead>
              <TableHead className="w-20">用户数</TableHead>
              <TableHead className="w-24">权限数</TableHead>
              <TableHead className="w-24">菜单数</TableHead>
              <TableHead className="w-40" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {roles.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-medium">
                  {r.name}
                  {r.name === 'admin' && (
                    <Badge variant="secondary" className="ml-2 text-[10px]">
                      内置
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-muted-foreground">{r.description || '—'}</TableCell>
                <TableCell className="tabular-nums">{r._count.users}</TableCell>
                <TableCell className="tabular-nums">{r.rolePermissions.length}</TableCell>
                <TableCell className="tabular-nums">{r.roleMenus.length}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" title="分配权限" onClick={() => openPerm(r)}>
                      <KeyRound className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" title="分配菜单" onClick={() => openMenu(r)}>
                      <ScrollText className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      title="编辑"
                      onClick={() => {
                        setForm({ name: r.name, description: r.description ?? '' })
                        setEditTarget(r)
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={r.name === 'admin'}
                      onClick={() => setDelTarget(r)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* 新建/编辑 */}
      <Dialog open={!!editTarget} onOpenChange={(o) => !o && setEditTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editTarget === 'new' ? '新建角色' : '编辑角色'}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <div className="grid gap-1.5">
              <Label>名称</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                disabled={typeof editTarget === 'object' && editTarget?.name === 'admin'}
              />
            </div>
            <div className="grid gap-1.5">
              <Label>描述</Label>
              <Input
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              取消
            </Button>
            <Button
              disabled={busy || !form.name.trim()}
              onClick={() =>
                run(
                  () =>
                    editTarget === 'new'
                      ? createRole(form.name, form.description)
                      : updateRole((editTarget as Role).id, form),
                  '已保存'
                )
              }
            >
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分配权限 */}
      <Dialog open={!!permTarget} onOpenChange={(o) => !o && setPermTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>分配权限 · {permTarget?.name}</DialogTitle>
            <DialogDescription>勾选该角色拥有的操作权限</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {Object.entries(permGroups).map(([g, ps]) => (
              <div key={g}>
                <div className="mb-1.5 text-xs font-semibold text-muted-foreground">{g}</div>
                <div className="grid grid-cols-2 gap-1.5">
                  {ps.map((p) => (
                    <label key={p.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={checked.has(p.id)} onCheckedChange={() => toggle(p.id)} />
                      <span className="font-mono text-xs">{p.name}</span>
                      <span className="truncate text-xs text-muted-foreground">
                        {p.description}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPermTarget(null)}>
              取消
            </Button>
            <Button
              disabled={busy}
              onClick={() =>
                permTarget &&
                run(
                  () => setRolePermissions(permTarget.id, [...checked]),
                  `已更新 ${permTarget.name} 的权限`
                )
              }
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 分配菜单 */}
      <Dialog open={!!menuTarget} onOpenChange={(o) => !o && setMenuTarget(null)}>
        <DialogContent className="max-h-[80vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>分配菜单 · {menuTarget?.name}</DialogTitle>
            <DialogDescription>勾选侧边栏可见菜单（含父级分组）</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            {menuTree(null).map((m) => (
              <div key={m.id}>
                <label className="flex items-center gap-2 text-sm font-medium">
                  <Checkbox checked={checked.has(m.id)} onCheckedChange={() => toggle(m.id)} />
                  {m.name}
                  <span className="font-mono text-xs text-muted-foreground">{m.url}</span>
                </label>
                <div className="ml-7 mt-1 grid gap-1">
                  {menuTree(m.id).map((c) => (
                    <label key={c.id} className="flex items-center gap-2 text-sm">
                      <Checkbox checked={checked.has(c.id)} onCheckedChange={() => toggle(c.id)} />
                      {c.name}
                      <span className="font-mono text-xs text-muted-foreground">{c.url}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMenuTarget(null)}>
              取消
            </Button>
            <Button
              disabled={busy}
              onClick={() =>
                menuTarget &&
                run(() => setRoleMenus(menuTarget.id, [...checked]), `已更新 ${menuTarget.name} 的菜单`)
              }
            >
              保存
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 删除 */}
      <AlertDialog open={!!delTarget} onOpenChange={(o) => !o && setDelTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除</AlertDialogTitle>
            <AlertDialogDescription>
              删除角色 <code className="rounded bg-muted px-1">{delTarget?.name}</code>
              及其权限/菜单绑定（绑定了用户的角色会被拒绝）。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={busy}
              onClick={() => delTarget && run(() => deleteRole(delTarget.id), '已删除')}
            >
              删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
