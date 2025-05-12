'use client'

import { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
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

export default function RoleManagement() {
  const { toast } = useToast()
  // const router = useRouter()
  const [roles, setRoles] = useState([])
  const [newRoleName, setNewRoleName] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {}, [])

  return (
    <div className="space-y-4">
      <div className="flex space-x-2">
        <Input
          type="text"
          placeholder="新角色名称"
          value={newRoleName}
          onChange={(e) => setNewRoleName(e.target.value)}
        />
        <Button onClick={() => {}} disabled={isLoading || !newRoleName}>
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
            <TableRow key={role}>
              <TableCell>{role}</TableCell>
              <TableCell>
                <Button
                  variant="destructive"
                >
                  删除
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
