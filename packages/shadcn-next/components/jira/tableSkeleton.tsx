import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Loader2 } from 'lucide-react'

/**
 * Jira表格骨架屏组件
 * 用于在数据加载时显示占位内容
 * @param pageSize 每页显示的行数
 */
export function InvoicesTableSkeleton({ pageSize }: { pageSize: number }) {
  // 限制最大显示行数，避免性能问题
  const visibleRows = Math.min(pageSize, 10)

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-center w-full h-10 mb-4">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="ml-2">加载数据中...</span>
      </div>

      <Table className="w-full">
        <TableHeader>
          <TableRow>
            <TableHead>单号</TableHead>
            <TableHead className="w-[100px]">客户名称</TableHead>
            <TableHead>描述</TableHead>
            <TableHead className="w-[120px]">状态</TableHead>
            <TableHead>标签</TableHead>
            <TableHead className="w-[100px]">经办人</TableHead>
            <TableHead className="w-[100px]">创建人</TableHead>
            <TableHead className="w-[100px]">创建时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: visibleRows }).map((_, index) => (
            <TableRow key={index}>
              {Array.from({ length: 8 }).map((_, cellIndex) => (
                <TableCell key={cellIndex}>
                  <Skeleton className="h-6 w-full" />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
