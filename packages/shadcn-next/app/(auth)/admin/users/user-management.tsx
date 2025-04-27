'use client'

import { useState, useEffect, useCallback } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { prisma } from '@/lib/prisma'
import { User, Role } from '@/types/prisma'

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const fetchUsers = useCallback(async () => {
    const users = await prisma.user.findMany()

    if (!users) {
      toast({
        title: '获取用户失败',
        description: '未找到用户',
        variant: 'destructive',
      })
    } else {
      setUsers(users)
    }
  }, [toast])


  const fetchRoles = useCallback(async () => {
    const roles = await prisma.role.findMany()

    if (!roles) {
      toast({
        title: '获取角色失败',
        description: '未找到角色',
        variant: 'destructive',
      })
    } else {
      setRoles(roles)
    }
  }, [toast])

  const updateUserRole = useCallback(async (userId: string, roleId: string) => {
    setIsLoading(true)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { roleId: roleId },
    })

    if (!updatedUser) {
      toast({
        title: '更新用户角色失败',
        description: '未找到用户',
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


  if (isLoading) {
    return <div>加载用户中...</div>
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
            <TableCell>{user.username}</TableCell>
            <TableCell>{user.email}</TableCell>
            <TableCell>{user.roleId}</TableCell>
            <TableCell>
              <Select
                onValueChange={(value) => updateUserRole(user.id, value)}
                defaultValue={`${user.roleId}`}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="选择角色" />
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

