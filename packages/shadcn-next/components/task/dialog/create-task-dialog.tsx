'use client'

import type React from 'react'

import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { CreateTaskRequest, CreateKmsRequest } from '../type'

interface CreateTaskDialogProps {
  open: boolean
  taskMode: string
  onOpenChange: (open: boolean) => void
  onSubmit: (task: CreateTaskRequest | CreateKmsRequest, type: string) => void
}

export function CreateTaskDialog({
  open,
  taskMode,
  onOpenChange,
  onSubmit,
}: CreateTaskDialogProps) {
  const [typeFilter, setTypeFilter] = useState(taskMode)
  useEffect(() => {
    setTypeFilter(taskMode)
  }, [taskMode])
  // Jira
  const [jql, setJql] = useState(
    'assignee = currentUser() AND resolution = Unresolved order by updated DESC'
  )
  const [descriptionLimit, setDescriptionLimit] = useState(400)
  const [commentsLimit, setCommentsLimit] = useState(10)
  const [pageSize, setPageSize] = useState(500)
  const [startAt, setStartAt] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // KMS
  const [apiUrl, setApiUrl] = useState('')
  const [apiKey, setApiKey] = useState('')
  const [model, setModel] = useState('')
  // optimizer_type: str = "html2md"  # 优化器类型 html2md xunfei baichuan compatible
  const [optimizerType, setOptimizerType] = useState<
    'html2md' | 'xunfei' | 'baichuan' | 'compatible'
  >('html2md')
  const [startUrl, setStartUrl] = useState(
    'http://kms.new-see.com:8090/pages/viewpage.action?pageId=27363329'
  )

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(
        typeFilter === 'jira'
          ? {
              jql,
              description_limit: descriptionLimit,
              comments_limit: commentsLimit,
              page_size: pageSize,
              start_at: startAt,
            }
          : {
              api_url: apiUrl,
              api_key: apiKey,
              model: model,
              optimizer_type: optimizerType,
              start_url: startUrl,
            },
        typeFilter
      )

      // Reset form
      setJql(
        'assignee = currentUser() AND resolution = Unresolved order by updated DESC'
      )
      setDescriptionLimit(400)
      setCommentsLimit(10)
      setPageSize(500)
      setStartAt(0)
      setApiUrl('')
      setApiKey('')
      setModel('')
      setOptimizerType('html2md')
      setStartUrl(
        'http://kms.new-see.com:8090/pages/viewpage.action?pageId=27363329'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>创建爬虫任务</DialogTitle>
          <DialogDescription>配置{typeFilter}查询参数</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label
                htmlFor="type-filter"
                className="text-sm text-right font-medium mb-1 block"
              >
                任务类型
              </Label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="col-span-3" id="type-filter">
                  <SelectValue placeholder="选择类型" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jira">Jira工单爬虫任务</SelectItem>
                  <SelectItem value="kms">Confluence爬虫任务</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {typeFilter === 'jira' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="jql" className="text-right">
                    JQL查询
                  </Label>
                  <Textarea
                    id="jql"
                    value={jql}
                    onChange={(e) => setJql(e.target.value)}
                    placeholder="输入JQL查询语句"
                    className="col-span-3"
                    rows={3}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description-limit" className="text-right">
                    描述截断长度
                  </Label>
                  <Input
                    id="description-limit"
                    type="number"
                    value={descriptionLimit}
                    onChange={(e) =>
                      setDescriptionLimit(Number(e.target.value))
                    }
                    className="col-span-3"
                    min={1}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="comments-limit" className="text-right">
                    评论限制
                  </Label>
                  <Input
                    id="comments-limit"
                    type="number"
                    value={commentsLimit}
                    onChange={(e) => setCommentsLimit(Number(e.target.value))}
                    className="col-span-3"
                    min={1}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="page-size" className="text-right">
                    每页数量
                  </Label>
                  <Input
                    id="page-size"
                    type="number"
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="col-span-3"
                    min={1}
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-at" className="text-right">
                    起始位置
                  </Label>
                  <Input
                    id="start-at"
                    type="number"
                    value={startAt}
                    onChange={(e) => setStartAt(Number(e.target.value))}
                    className="col-span-3"
                    min={0}
                    required
                  />
                </div>
              </>
            )}

            {typeFilter === 'kms' && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="start-url" className="text-right">
                    起始URL
                  </Label>
                  <Input
                    id="start-url"
                    value={startUrl}
                    onChange={(e) => setStartUrl(e.target.value)}
                    placeholder="输入起始URL"
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="optimizer-type" className="text-right">
                    优化器类型
                  </Label>
                  <Select
                    value={optimizerType}
                    onValueChange={(value) =>
                      setOptimizerType(
                        value as
                          | 'html2md'
                          | 'xunfei'
                          | 'baichuan'
                          | 'compatible'
                      )
                    }
                  >
                    <SelectTrigger className="col-span-3" id="optimizer-type">
                      <SelectValue placeholder="选择优化器类型" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="html2md">HTML转Markdown</SelectItem>
                      <SelectItem value="xunfei">讯飞</SelectItem>
                      <SelectItem value="baichuan">百川</SelectItem>
                      <SelectItem value="compatible">兼容模式</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {['xunfei', 'baichuan', 'compatible'].includes(
                  optimizerType
                ) && (
                  <>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="api-url" className="text-right">
                        API URL
                      </Label>
                      <Input
                        id="api-url"
                        value={apiUrl}
                        onChange={(e) => setApiUrl(e.target.value)}
                        placeholder="输入API URL"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="api-key" className="text-right">
                        API Key
                      </Label>
                      <Input
                        id="api-key"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="输入API Key"
                        className="col-span-3"
                      />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="model" className="text-right">
                        模型
                      </Label>
                      <Input
                        id="model"
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        placeholder="输入模型名称"
                        className="col-span-3"
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? '提交中...' : '创建'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
