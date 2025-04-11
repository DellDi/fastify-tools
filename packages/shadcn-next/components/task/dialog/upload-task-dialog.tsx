import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useState } from 'react'

export interface DifyUploadRequest {
  dataset_prefix: string
  max_docs: number
  indexing_technique: 'high_quality' | 'economy' | 'parent' | 'qa'
}

interface UploadTaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  crawlerTaskId: string
  onUpload: (crawlerTaskId: string, payload: DifyUploadRequest) => Promise<void>
}

export function UploadTaskDialog({
  open,
  onOpenChange,
  crawlerTaskId,
  onUpload,
}: UploadTaskDialogProps) {
  const [datasetPrefix, setDatasetPrefix] = useState('智慧数据标准知识库')
  const [maxDocs, setMaxDocs] = useState(12000)
  const [indexingTechnique, setIndexingTechnique] = useState<'high_quality' | 'economy' | 'parent' | 'qa'>('high_quality')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onUpload(crawlerTaskId, {
        dataset_prefix: datasetPrefix,
        max_docs: maxDocs,
        indexing_technique: indexingTechnique,
      })
      onOpenChange(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>启动 Dify 知识库导入</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div>
            <label className="text-sm font-medium">数据集名称前缀</label>
            <Input
              value={datasetPrefix}
              onChange={(e) => setDatasetPrefix(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">每个数据集的最大文档数量</label>
            <Input
              type="number"
              value={maxDocs}
              onChange={(e) => setMaxDocs(Number(e.target.value))}
              min={1}
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium">索引技术</label>
            <Select
              value={indexingTechnique}
              onValueChange={(value) => setIndexingTechnique(value as 'high_quality' | 'economy' | 'parent' | 'qa')}
            >
              <SelectTrigger>
                <SelectValue placeholder="选择索引技术" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high_quality">高质量</SelectItem>
                <SelectItem value="economy">经济</SelectItem>
                <SelectItem value="parent">父子检索</SelectItem>
                <SelectItem value="qa">问答</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSubmitting}>
            取消
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? '提交中...' : '启动'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}