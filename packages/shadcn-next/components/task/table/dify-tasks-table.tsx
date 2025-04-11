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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { RefreshCw, Trash } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'
import { DifyTask } from '../type'
import { fetchFastApi } from '@/utils/fetch/fastFetch'
import { DeleteDifyTaskDialog } from '../dialog/delete-dify-task-dialog'

export function DifyTasksTable() {
  const [tasks, setTasks] = useState<DifyTask[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [limit] = useState(10)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const { toast } = useToast()

  // 弹窗状态管理
  const [deleteDifyTaskDialogOpen, setDeleteDifyTaskDialogOpen] =
    useState(false)
  const [selectedTask, setSelectedTask] = useState<DifyTask | null>(null)

  const fetchTasks = async () => {
    setLoading(true)
    try {
      const skip = (currentPage - 1) * limit
      let url = `/scrapy/api/dify/tasks?skip=${skip}&limit=${limit}`

      if (statusFilter !== 'all') {
        url += `&status=${statusFilter}`
      }

      const response = await fetchFastApi(url, { method: 'GET' })

      const data = await response
      setTasks(data.tasks || [])
      if (data.total) {
        setTotalPages(Math.ceil(data.total / limit))
      }
    } catch (error) {
      console.error('Error fetching Dify tasks:', error)
      toast({
        title: '获取任务失败',
        description: '请检查网络连接或API权限',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // 删除Dify任务接口
  const handleDeleteDifyTask = async (taskId: string) => {
    try {
      const response = await fetchFastApi(`/scrapy/api/dify/tasks/${taskId}`, {
        method: 'DELETE',
      })

      if (response instanceof Error) {
        toast({
          title: '删除失败',
          description: response.message,
          variant: 'destructive',
        })
        return
      }
      toast({
        title: '删除成功',
        description: '任务已成功删除',
      })
      setDeleteDifyTaskDialogOpen(false)
      fetchTasks() // 刷新任务列表
    } catch (error) {
      console.error('Error deleting Dify task:', error)
      toast({
        title: '删除失败',
        description: '请检查API权限',
        variant: 'destructive',
      })
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running':
        return '进行中'
      case 'completed':
        return '已完成'
      case 'failed':
        return '失败'
      default:
        return '未知'
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [currentPage, statusFilter])

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Dify 任务列表</CardTitle>
            <CardDescription>管理 Dify 任务</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={fetchTasks}
              disabled={loading}
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
              />
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
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>任务ID</TableHead>
                  <TableHead>状态</TableHead>
                  <TableHead>数据集前缀</TableHead>
                  <TableHead>创建时间</TableHead>
                  <TableHead>更新时间</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <div className="flex justify-center items-center">
                        <RefreshCw className="h-6 w-6 animate-spin mr-2" />
                        加载中...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : tasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      暂无数据
                    </TableCell>
                  </TableRow>
                ) : (
                  tasks.map((task) => (
                    <TableRow key={task.task_id}>
                      <TableCell className="font-medium max-w-[150px] truncate">
                        {task.task_id}
                      </TableCell>
                      <TableCell>
                        <Badge>{getStatusBadge(task.status)}</Badge>
                      </TableCell>
                      <TableCell>{task.dataset_prefix}</TableCell>
                      <TableCell>{task.created_at}</TableCell>
                      <TableCell>{task.updated_at}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedTask(task)
                            setDeleteDifyTaskDialogOpen(true)
                          }}
                        >
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm text-nowrap text-muted-foreground">
                共 {totalPages} 页，当前第 {currentPage} 页
              </div>
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
      </Card>

      {/* 对话框组件 */}
      {selectedTask && (
        <DeleteDifyTaskDialog
          open={deleteDifyTaskDialogOpen}
          onOpenChange={setDeleteDifyTaskDialogOpen}
          taskId={selectedTask.task_id}
          onDelete={handleDeleteDifyTask}
        />
      )}
    </>
  )
}
