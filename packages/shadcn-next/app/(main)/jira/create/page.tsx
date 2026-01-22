'use client'

import type React from 'react'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2 } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

export default function JiraForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    point: 'app.create_jira_tool',
    title: '',
    description: '',
    labels: 'SaaS内部已审核',
    assignee: '',
    jiraUser: '',
    jiraPassword: '',
    customerName: '',
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      const response = await fastifyFetch('/dify/create-jira', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer zd-808611`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || '创建工单失败')
      }

      const data = await response.json()
      console.log('Success:', data)
      setSuccess(true)
      // 重置表单
      setFormData({
        point: 'ping',
        title: '',
        description: '',
        labels: 'SaaS内部已审核',
        assignee: '',
        jiraUser: '',
        jiraPassword: '',
        customerName: '',
      })
    } catch (err) {
      console.error('Error:', err)
      setError(err instanceof Error ? err.message : '创建工单时发生错误')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">创建 Jira 工单</CardTitle>
          <CardDescription>填写以下表单创建新的 Jira 工单</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>错误</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 bg-green-50 border-green-200">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-600">成功</AlertTitle>
              <AlertDescription>工单已成功创建</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="title">工单标题</Label>
              <Input
                id="title"
                name="title"
                placeholder="[组织工单] 新增测试工单"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">工单描述</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="请输入工单的详细描述"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="labels">标签</Label>
              <Input
                id="labels"
                name="labels"
                value={formData.labels}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="assignee">负责人</Label>
              <Input
                id="assignee"
                name="assignee"
                placeholder="zengdi"
                value={formData.assignee}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jiraUser">Jira 用户名</Label>
              <Input
                id="jiraUser"
                name="jiraUser"
                placeholder="zengdi"
                value={formData.jiraUser}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="jiraPassword">Jira 密码</Label>
              <Input
                id="jiraPassword"
                name="jiraPassword"
                type="password"
                placeholder="请输入Jira密码"
                value={formData.jiraPassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="customerName">客户名称</Label>
              <Input
                id="customerName"
                name="customerName"
                placeholder="测试组织"
                value={formData.customerName}
                onChange={handleChange}
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? '提交中...' : '创建工单'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
