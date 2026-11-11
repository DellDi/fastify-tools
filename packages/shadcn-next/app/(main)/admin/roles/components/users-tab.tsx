'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { listRoles, listUsers, setUserRole } from '@/app/actions/rbac-actions'

type User = Awaited<ReturnType<typeof listUsers>>[number]
type Role = Awaited<ReturnType<typeof listRoles>>[number]

export function UsersTab() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState<string | null>(null)

  const reload = useCallback(async () => {
    try {
      const [u, r] = await Promise.all([listUsers(), listRoles()])
      setUsers(u)
      setRoles(r)
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '加载失败')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const assign = async (u: User, roleId: string) => {
    setBusyId(u.id)
    try {
      await setUserRole(u.id, roleId)
      toast.success(`已将 ${u.username || u.email} 角色更新`)
      await reload()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : '更新失败')
    } finally {
      setBusyId(null)
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
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户名</TableHead>
            <TableHead>邮箱</TableHead>
            <TableHead className="w-32">当前角色</TableHead>
            <TableHead className="w-48">更改角色</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.map((u) => (
            <TableRow key={u.id}>
              <TableCell className="font-medium">
                {u.username || '—'}
                {u.isSuperAdmin && (
                  <Badge variant="secondary" className="ml-2 text-[10px]">
                    超管
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground">{u.email}</TableCell>
              <TableCell>{u.userRole?.name || '—'}</TableCell>
              <TableCell>
                <Select
                  value={u.roleId ?? undefined}
                  disabled={busyId === u.id || u.isSuperAdmin === true}
                  onValueChange={(v) => assign(u, v)}
                >
                  <SelectTrigger className="h-8 w-44">
                    <SelectValue placeholder="选择角色" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
