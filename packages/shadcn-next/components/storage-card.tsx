'use client'

import { Database } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useSystemStatus } from "@/hooks/use-system-status"

const formatBytes = (bytes: number) => {
  if (bytes >= 1024 ** 3) return `${(bytes / 1024 ** 3).toFixed(1)}G`
  if (bytes >= 1024 ** 2) return `${(bytes / 1024 ** 2).toFixed(1)}M`
  return `${(bytes / 1024).toFixed(0)}K`
}

export function StorageCard() {
  const { data } = useSystemStatus()

  const disk = data?.disk
  const percent = disk ? Math.min(100, (disk.usedBytes / disk.totalBytes) * 100) : 0
  const usageText = disk
    ? `${(disk.usedBytes / 1024 ** 3).toFixed(1)} GB / ${(disk.totalBytes / 1024 ** 3).toFixed(1)} GB`
    : '-- GB / -- GB'
  const dbText = data?.databases?.length
    ? data.databases.map((d) => `${d.name} ${formatBytes(d.sizeBytes)}`).join(' · ')
    : null

  return (
      <Card className="rounded-md text-xs shadow-xs">
        <CardContent className="flex items-start gap-2.5 p-2.5">
          <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-accent text-accent-foreground">
            <Database className="h-5 w-5 text-muted-foreground"/>
          </div>
          <div className="grid flex-1 gap-1">
            <p className="font-medium">数据库</p>
            <p className="text-muted-foreground">{usageText}</p>
            <Progress
                value={percent}
                className="mt-1"
                aria-label={`${usageText} used`}
            />
            {dbText && <p className="text-[11px] text-muted-foreground/80">{dbText}</p>}
          </div>
        </CardContent>
      </Card>
  )
}
