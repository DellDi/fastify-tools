'use client'

import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

// 导入迁移后的表格组件
import { TasksTable } from './table/tasks-table'
import { DifyTasksTable } from './table/dify-tasks-table'

export function TasksContainer() {
  return (
    <Tabs defaultValue="tasks">
      <TabsList>
        <TabsTrigger value="tasks">爬虫任务</TabsTrigger>
        <TabsTrigger value="dify-tasks">Dify任务</TabsTrigger>
      </TabsList>
      <TabsContent value="tasks">
        <TasksTable />
      </TabsContent>
      <TabsContent value="dify-tasks">
        <DifyTasksTable />
      </TabsContent>
    </Tabs>
  )
}
