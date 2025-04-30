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
import { MoreHorizontal, Plus, RefreshCw, Download, Filter } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Task,
  CreateTaskRequest,
  CreateKmsRequest,
  DifyUploadRequest,
} from '../type'
import { fetchFastApi } from '@/utils/fetch/fastFetch'
import { CreateTaskDialog } from '../dialog/create-task-dialog'
import { DeleteTaskDialog } from '../dialog/delete-task-dialog'
import { UploadTaskDialog } from '../dialog/upload-task-dialog'

import { Progress } from '@/components/ui/progress'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

interface TasksTableProps {
  onCreateTask: () => void
  onDeleteTask: (task: Task) => void
  onUploadTask: (task: Task) => void
  onFilterChange: (value: string) => void
}

export function TasksTable() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const { toast } = useToast()
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('jira')

  // 弹窗状态管理
  const [createDialogOpen, setCreateDialogOpen] = useState(false)
  const [deleteTaskDialogOpen, setDeleteTaskDialogOpen] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  // 下载状态管理
  const [isDownloading, setIsDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false)
  const [downloadFileName, setDownloadFileName] = useState('')

  const handleFilterChange = (value: string) => {
    setTypeFilter(value)
    fetchTasks()
  }

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
      setTasks(data.tasks || [])

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

  const handleDownload = async (taskId: string, mode: string) => {
    try {
      // 打开下载对话框并初始化进度
      setIsDownloading(true)
      setDownloadProgress(0)
      setDownloadDialogOpen(true)
      setDownloadFileName('准备下载...')

      // 模拟进度增长 - 使用 setInterval 定期增加进度值
      const progressInterval = setInterval(() => {
        setDownloadProgress((prev) => {
          // 最多增长到 90%，剩余 10% 留给实际文件处理
          if (prev < 90) {
            return prev + Math.random() * 5
          }
          return prev
        })
      }, 300)

      // 发起下载请求
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
      } else {
        // 尝试直接从URL中提取文件名作为备选方案
        const urlParts = response.url.split('/')
        const lastPart = urlParts[urlParts.length - 1]
        if (lastPart && lastPart !== taskId) {
          filename = `${lastPart}.zip`
        } else {
          filename = `task_${taskId}.zip`
        }
      }

      setDownloadFileName(filename)

      // 创建 blob 并下载
      const blob = await response.blob()

      // 完成最后 10% 进度
      clearInterval(progressInterval)
      setDownloadProgress(100)

      // 延迟一小段时间，让用户看到 100% 进度
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 执行下载
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

      // 关闭下载对话框
      setTimeout(() => {
        setDownloadDialogOpen(false)
        setIsDownloading(false)
      }, 1000)
    } catch (error) {
      console.error('Error downloading file:', error)
      toast({
        title: '下载失败',
        description: '请检查网络连接或API权限',
        variant: 'destructive',
      })
      setDownloadDialogOpen(false)
      setIsDownloading(false)
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

  useEffect(() => {
    fetchTasks()
  }, [currentPage, statusFilter, typeFilter])

  // 创建任务接口
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

      setCreateDialogOpen(false)
      fetchTasks() // 刷新任务列表
    } catch (error) {
      console.error('Error creating task:', error)
      toast({
        title: '创建失败',
        description: '请检查输入数据或API权限',
        variant: 'destructive',
      })
    }
  }

  // 删除任务接口
  const handleDeleteTask = async (taskId: string, mode: string) => {
    try {
      await fetchFastApi(`/scrapy/api/${mode}/task/${taskId}`, {
        method: 'DELETE',
      })

      toast({
        title: '删除成功',
        description: '任务已成功删除',
      })

      setDeleteTaskDialogOpen(false)
      fetchTasks() // 刷新任务列表
    } catch (error) {
      console.error('Error deleting task:', error)
      toast({
        title: '删除失败',
        description: '请检查API权限',
        variant: 'destructive',
      })
    }
  }

  // 上传任务到Dify接口
  const handleUploadTask = async (
    crawlerTaskId: string,
    payload: DifyUploadRequest
  ) => {
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
      setUploadDialogOpen(false)
      fetchTasks() // 刷新任务列表
    } catch (error) {
      console.error('Error uploading task:', error)
      toast({
        title: '启动失败',
        description: '请检查输入数据或API权限',
        variant: 'destructive',
      })
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>爬虫任务列表</CardTitle>
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
          <Button
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => setCreateDialogOpen(true)}
          >
            <Plus className="h-4 w-4 mr-1" />
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
            <Select value={typeFilter} onValueChange={handleFilterChange}>
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
                          aria-placeholder="下载"
                          onClick={() =>
                            handleDownload(task.task_id, task.task_mode)
                          }
                          disabled={isDownloading}
                        >
                          <Download
                            className={`h-2 w-2 ${
                              isDownloading ? 'animate-pulse' : ''
                            }`}
                          />
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            disabled={isDownloading}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTask(task)
                              setDeleteTaskDialogOpen(true)
                            }}
                            className="text-red-600"
                          >
                            删除
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedTask(task)
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
                />
              </PaginationItem>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pageNumber = i + 1
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      isActive={pageNumber === currentPage}
                      onClick={() => setCurrentPage(pageNumber)}
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
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </CardContent>

      {/* 下载进度对话框 */}
      <Dialog open={downloadDialogOpen} onOpenChange={setDownloadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>文件下载中</DialogTitle>
            <DialogDescription>正在下载: {downloadFileName}</DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Progress value={downloadProgress} className="w-full" />
            <p className="text-center mt-2">{Math.round(downloadProgress)}%</p>
          </div>
        </DialogContent>
      </Dialog>

      {/* 对话框组件 */}
      <CreateTaskDialog
        open={createDialogOpen}
        taskMode={typeFilter}
        onOpenChange={setCreateDialogOpen}
        onSubmit={handleCreateTask}
      />

      {selectedTask && (
        <DeleteTaskDialog
          open={deleteTaskDialogOpen}
          onOpenChange={setDeleteTaskDialogOpen}
          taskId={selectedTask.task_id}
          mode={selectedTask.task_mode}
          onDelete={handleDeleteTask}
        />
      )}

      <UploadTaskDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        crawlerTaskId={selectedTask?.task_id || ''}
        onUpload={handleUploadTask}
      />
    </Card>
  )
}
