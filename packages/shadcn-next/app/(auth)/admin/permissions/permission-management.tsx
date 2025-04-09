'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState([])
  const [newPermissionName, setNewPermissionName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  useEffect(() => {
    fetchPermissions().then(r => {
    })
  }, [])

  async function fetchPermissions() {
    const { data, error } = await supabase
    .from('permissions')
    .select('*')
    .order('name')

    if (error) {
      toast({
        title: '获取权限失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setPermissions(data)
    }
  }

  async function addPermission() {
    setIsLoading(true)
    const { data, error } = await supabase
    .from('permissions')
    .insert({ name: newPermissionName })
    .select()

    if (error) {
      toast({
        title: '添加权限失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      setNewPermissionName('')
      await fetchPermissions()
      toast({
        title: '权限添加成功',
        description: `已添加权限: ${newPermissionName}`,
      })
    }
    setIsLoading(false)
  }

  async function deletePermission(id: number) {
    const { error } = await supabase
    .from('permissions')
    .delete()
    .eq('id', id)

    if (error) {
      toast({
        title: '删除权限失败',
        description: error.message,
        variant: 'destructive',
      })
    } else {
      await fetchPermissions()
      toast({
        title: '权限删除成功',
        description: '该权限已被删除',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="新权限名称"
          value={newPermissionName}
          onChange={(e) => setNewPermissionName(e.target.value)}
        />
        <Button onClick={addPermission} disabled={isLoading || !newPermissionName}>
          {isLoading ? '添加中...' : '添加权限'}
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>权限名称</TableHead>
            <TableHead>操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {permissions.map((permission) => (
            <TableRow key={permission.id}>
              <TableCell>{permission.name}</TableCell>
              <TableCell>
                <Button variant="destructive" onClick={() => deletePermission(permission.id)}>删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

