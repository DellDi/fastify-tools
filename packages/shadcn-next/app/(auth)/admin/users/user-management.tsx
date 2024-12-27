'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { usePermissions } from '@/hooks/use-permissions'
import { type Role, type User } from '@supabase/supabase-js'
import { Skeleton } from '@/components/ui/skeleton'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()
  const { hasPermission, isLoading: permissionsLoading } = usePermissions()

  const fetchUsers = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
    .from('auth.users')
    .select('*')
    .order('created_at')

    if (error) {
      toast({
        title: '获取用户失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setUsers(data)
    }
  }, [toast])


  const fetchRoles = useCallback(async () => {
    const supabase = createClient()
    const { data, error } = await supabase
    .from('roles')
    .select('*')
    .order('name')

    if (error) {
      toast({
        title: '获取角色失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setRoles(data)
    }
  }, [toast])

  const updateUserRole = useCallback(async (userId: string, roleId: string) => {
    setIsLoading(true)
    const supabase = createClient()
    const { error } = await supabase
    .from('users')
    .update({ role_id: roleId })
    .eq('id', userId)

    if (error) {
      toast({
        title: '更新用户角色失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      await fetchUsers()
      toast({
        title: '用户角色更新成功',
        description: '用户角色已被更新',
      })
    }
    setIsLoading(false)
  }, [toast, fetchUsers])

  useEffect(() => {
    fetchUsers().catch(() => {
    })
    fetchRoles().catch(() => {
    })
  }, [fetchUsers, fetchRoles])


  if (permissionsLoading) {
    return <div>加载权限中...</div>
  }

  if (!hasPermission('manage_users')) {
    return <div>您没有管理用户的权限。</div>
  }

  if (isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="h-[125px] w-[250px] rounded-xl"/>
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]"/>
          <Skeleton className="h-4 w-[200px]"/>
        </div>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>用户名</TableHead>
          <TableHead>邮箱</TableHead>
          <TableHead>当前角色</TableHead>
          <TableHead>更改角色</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((user) => (
          <TableRow key={user.id}>
            <TableCell>{user.user_metadata.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.role_id}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => updateUserRole(user.id, value)}
                defaultValue={`${user.role_id}`}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择角色"/>
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

