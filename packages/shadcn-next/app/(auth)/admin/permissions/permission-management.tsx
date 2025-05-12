'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'

export default function PermissionManagement() {
  const [permissions, setPermissions] = useState([])
  const [newPermissionName, setNewPermissionName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="新权限名称"
          value={newPermissionName}
          onChange={(e) => setNewPermissionName(e.target.value)}
        />
        <Button disabled={isLoading || !newPermissionName}>
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
            <TableRow key={permission}>
              <TableCell>{permission}</TableCell>
              <TableCell>
                <Button variant="destructive">删除</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
