'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { BrowserPanel } from './components/browser-panel'
import { DiskPanel } from './components/disk-panel'
import { DockerPanel } from './components/docker-panel'

// 服务器文件中心：浏览（全盘只读+白名单可写）/ 磁盘分析 / Docker 清理
export function FileManager() {
  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">文件管理</h1>
          <p className="text-sm text-muted-foreground">
            服务器文件中心 · 全盘只读浏览，写操作仅限 /opt、/srv
          </p>
        </div>
      </div>
      <Tabs defaultValue="browse" className="flex min-h-0 flex-1 flex-col">
        <TabsList className="w-fit">
          <TabsTrigger value="browse">浏览</TabsTrigger>
          <TabsTrigger value="disk">磁盘分析</TabsTrigger>
          <TabsTrigger value="docker">Docker 清理</TabsTrigger>
        </TabsList>
        <TabsContent value="browse" className="mt-4 min-h-0 flex-1">
          <BrowserPanel />
        </TabsContent>
        <TabsContent value="disk" className="mt-4 min-h-0 flex-1 overflow-auto">
          <DiskPanel />
        </TabsContent>
        <TabsContent value="docker" className="mt-4 min-h-0 flex-1 overflow-auto">
          <DockerPanel />
        </TabsContent>
      </Tabs>
    </div>
  )
}
