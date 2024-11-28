'use client'

import { useState, useEffect } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { usePermissions } from '@/hooks/use-permissions'

export default function UserManagement() {
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClient()
  const { toast } = useToast()

  const { hasPermission, isLoading: permissionsLoading } = usePermissions()


  useEffect(() => {
    fetchUsers().catch(() => {})
    fetchRoles().catch(() => {})
  }, [])

  async function fetchUsers() {
    const { data, error } = await supabase
    .from('users')
    .select('*, roles(name)')
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
  }

  async function fetchRoles() {
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
  }

  async function updateUserRole(userId, roleId) {
    setIsLoading(true)
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
      fetchUsers()
      toast({
        title: '用户角色更新成功',
        description: '用户角色已被更新',
      })
    }
    setIsLoading(false)
  }

  if (permissionsLoading) {
    return <div>加载权限中...</div>
  }

  if (!hasPermission('manage_users')) {
    return <div>您没有管理用户的权限。</div>
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
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.roles?.name}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => updateUserRole(user.id, value)}
                defaultValue={user.role_id}
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

