'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export default function RoleManagement() {
  const { toast } = useToast()
  // const router = useRouter()
  const [roles, setRoles] = useState([])
  const [newRoleName, setNewRoleName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchRoles()
  }, [])


  if (permissionsLoading) {
    return <div>加载权限中...</div>
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

  async function addRole() {
    setIsLoading(true)
    const { data, error } = await supabase
    .from('roles')
    .insert({ name: newRoleName })
    .select()

    if (error) {
      toast({
        title: '添加角色失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setNewRoleName('')
      fetchRoles()
      toast({
        title: '角色添加成功',
        description: `已添加角色: ${newRoleName}`,
      })
    }
    setIsLoading(false)
  }

  async function deleteRole(id) {
    const { error } = await supabase
    .from('roles')
    .delete()
    .eq('id', id)

    if (error) {
      toast({
        title: '删除角色失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      fetchRoles()
      toast({
        title: '角色删除成功',
        description: '该角色已被删除',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="新角色名称"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <Button onClick={addRole} disabled={isLoading || !newRoleName}>
          {isLoading ? '添加中...' : '添加角色'}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>角色名称</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell>{role.name}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deleteRole(role.id)}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

