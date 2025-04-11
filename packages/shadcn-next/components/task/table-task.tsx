'use client'

import { useState, useEffect } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Plus, RefreshCw, Download, Filter } from 'lucide-react' // 在 import 部分添加新的组件引入
import { formatDate } from '@/utils/utils'
import { CreateTaskDialog } from './create-task-dialog'
import { DeleteTaskDialog } from './delete-task-dialog'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Task, CreateTaskRequest, CreateKmsRequest } from './type'
import { fetchFastApi } from '@/utils/fetch/fastFetch'
import { UploadTaskDialog } from './upload-task-dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { DifyTasksTable } from './dify-tasks-table'

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState<string>('all') // 在 TasksTable 函数内，useState 部分添加新的状态变量
  const [typeFilter, setTypeFilter] = useState<string>('jira')
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedTaskForUpload, setSelectedTaskForUpload] = useState<Task | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * limit
      let url = `/scrapy/api/${typeFilter}/tasks?skip=${skip}&limit=${limit}`

      // 添加筛选参数到 URL
      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }

      const response = await fetchFastApi(url, {
        method: 'GET',
      })

      if (response instanceof Error) {
        throw response
      }

      const data = await response
      setTasks(data.tasks || []) // Adjust based on actual API response structure

      // Calculate total pages if total count is provided in the response
      if (data.total) {
        setTotalPages(Math.ceil(data.total / limit))
      }
    } catch (error) {
      console.error('Error fetching tasks:', error)
      toast({
        title: '获取任务失败',
        description: '请检查网络连接或API权限',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTask = async (
    newTask: CreateTaskRequest | CreateKmsRequest,
    type: string
  ) => {
    try {
      await fetchFastApi(`/scrapy/api/${type}/crawl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...newTask,
        }),
      })

      toast({
        title: '创建成功',
        description: '新任务已成功创建',
      })

      fetchTasks()
      setCreateDialogOpen(false)
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: '创建失败',
        description: '请检查输入数据或API权限',
        variant: 'destructive',
      })
    }
  }

  const handleDeleteTask = async (taskId: string, mode: string) => {
    try {
      await fetchFastApi(`/scrapy/api/${mode}/task/${taskId}`, {
        method: 'DELETE',
      })

      toast({
        title: '删除成功',
        description: '任务已成功删除',
      })

      fetchTasks()
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: '删除失败',
        description: '请检查API权限',
        variant: 'destructive',
      })
    }
  }

  const handleUploadTask = async (crawlerTaskId: string, payload: any) => {
    try {
      await fetchFastApi(`/scrapy/api/dify/upload/${crawlerTaskId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      toast({
        title: '启动成功',
        description: 'Dify 知识库导入任务已启动',
      })
    } catch (error) {
      console.error('Error uploading task:', error)
      toast({
        title: '启动失败',
        description: '请检查输入数据或API权限',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <Badge className="bg-green-500">已完成</Badge>
      case 'pending':
      case 'running':
        return <Badge className="bg-yellow-500">进行中</Badge>
      case 'failed':
        return <Badge className="bg-red-500">失败</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const handleDownload = async (taskId: string, mode: string) => {
    try {
      const response = await fetchFastApi(
        `/scrapy/api/${mode}/download/${taskId}`,
        {
          method: 'GET',
        }
      )

      // 获取文件名
      const contentDisposition = response.headers.get('content-disposition')
      let filename = 'download.zip'
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="(.+)"/)
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1]
        }
      }

      // 创建 blob 并下载
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: '下载成功',
        description: '文件已成功下载',
      })
    } catch (error) {
      console.error('Error downloading file:', error)
      toast({
        title: '下载失败',
        description: '请检查网络连接或API权限',
        variant: 'destructive',
      })
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [currentPage, statusFilter, typeFilter])

  return (
    <Tabs defaultValue="tasks">
      <TabsList>
        <TabsTrigger value="tasks">爬虫任务</TabsTrigger>
        <TabsTrigger value="dify-tasks">Dify任务</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>任务列表</CardTitle>
              <CardDescription>管理爬虫任务</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={fetchTasks}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                新建任务
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <label
                  htmlFor="status-filter"
                  className="text-sm font-medium mb-1 block"
                >
                  任务状态
                </label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder="选择状态" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">全部</SelectItem>
                    <SelectItem value="completed">已完成</SelectItem>
                    <SelectItem value="pending">进行中</SelectItem>
                    <SelectItem value="failed">失败</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label
                  htmlFor="type-filter"
                  className="text-sm font-medium mb-1 block"
                >
                  任务类型
                </label>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger id="type-filter">
                    <SelectValue placeholder="选择类型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="jira">Jira工单</SelectItem>
                    <SelectItem value="kms">KMS知识库</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2 flex items-end">
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    setStatusFilter('all')
                    setTypeFilter('jira')
                  }}
                >
                  <Filter className="h-4 w-4 mr-2" />
                  重置筛选
                </Button>
                <Button variant="outline" onClick={fetchTasks} disabled={loading}>
                  <RefreshCw
                    className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`}
                  />
                  刷新数据
                </Button>
              </div>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>任务ID</TableHead>
                    <TableHead>模式</TableHead>
                    <TableHead>状态</TableHead>
                    <TableHead>消息</TableHead>
                    <TableHead>创建时间</TableHead>
                    <TableHead>更新时间</TableHead>
                    <TableHead>操作</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        <div className="flex justify-center items-center">
                          <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                          加载中...
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : tasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-10">
                        暂无数据
                      </TableCell>
                    </TableRow>
                  ) : (
                    tasks.map((task) => (
                      <TableRow key={task.task_id}>
                        <TableCell className="font-medium max-w-[150px] truncate">
                          {task.task_id}
                        </TableCell>
                        <TableCell>{task.task_mode}</TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {task.message}
                        </TableCell>
                        <TableCell>{formatDate(task.created_at)}</TableCell>
                        <TableCell>{formatDate(task.updated_at)}</TableCell>
                        <TableCell className=" min-w-[100px]">
                          {task.status.toLowerCase() === 'completed' && (
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-placeholder='下载'
                              onClick={() =>
                                handleDownload(task.task_id, task.task_mode)
                              }
                            >
                              <Download className="h-2 w-2" />
                            </Button>
                          )}

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTask(task)
                                  setDeleteDialogOpen(true)
                                }}
                                className="text-red-600"
                              >
                                删除
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedTaskForUpload(task)
                                  setUploadDialogOpen(true)
                                }}
                              >
                                启动 Dify 导入
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-nowrap text-muted-foreground">
                共 {totalPages} 页，当前第 {currentPage} 页
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      // disabled={currentPage === 1 || loading}
                    />
                  </PaginationItem>
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    const pageNumber = i + 1
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          isActive={pageNumber === currentPage}
                          onClick={() => setCurrentPage(pageNumber)}
                          // disabled={loading}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      // disabled={currentPage === totalPages || loading}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </CardContent>

          <CreateTaskDialog
            open={createDialogOpen}
            taskMode={typeFilter}
            onOpenChange={setCreateDialogOpen}
            onSubmit={handleCreateTask}
          />

          {selectedTask && (
            <DeleteTaskDialog
              open={deleteDialogOpen}
              onOpenChange={setDeleteDialogOpen}
              taskId={selectedTask.task_id}
              mode={selectedTask.task_mode}
              onDelete={handleDeleteTask}
            />
          )}

          <UploadTaskDialog
            open={uploadDialogOpen}
            onOpenChange={setUploadDialogOpen}
            crawlerTaskId={selectedTaskForUpload?.task_id || ''}
            onUpload={handleUploadTask}
          />
        </Card>
      </TabsContent>
      <TabsContent value="dify-tasks">
        <DifyTasksTable />
      </TabsContent>
    </Tabs>
  )
}
