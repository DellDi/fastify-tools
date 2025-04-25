import { Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useCallback, useRef, useState } from 'react'
import {
  FileBatchSuccessResponse,
  useHandleDrop,
  useHandleFileChange,
  useUploadProgress,
} from '@/hooks/use-file'
import { FileUploadStatus } from '@/components/upload/file-list'
import { toast } from '@/components/ui/use-toast'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

/**
 * 批量文件上传函数
 * @param {File[]} files - 要上传的文件数组
 * @returns {Promise<void>}
 */
const batchUploadFunction = async (files: File[]): Promise<void> => {
  const formData = new FormData()

  // 添加多个文件到同一个 FormData 对象
  files.forEach((file) => {
    formData.append('file', file)
  })

  try {
    const response = await fastifyFetch(`/upload/batch`, {
      method: 'POST',
      body: formData,
    })

    const fileInfo: FileBatchSuccessResponse = response
    toast({
      title: '批量上传成功',
      description: `已上传 ${fileInfo.uploadedFiles?.length || 0} 个文件`,
    })
  } catch (err) {
    console.error('批量上传失败:', err)
    toast({
      title: '批量上传失败',
      description: err instanceof Error ? err.message : '未知错误',
      variant: 'destructive',
    })
  }
}

/**
 * 批量文件上传组件
 * @component
 */
export function BatchUpload() {
  // 文件状态
  const [files, setFiles] = useState<File[]>([])
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 上传进度和状态
  const { progress, uploading, simulateUpload } =
    useUploadProgress(batchUploadFunction)
  // 处理拖拽事件
  const handleDrop = useHandleDrop(setFiles)
  // 处理文件改变事件
  const handleFileChange = useHandleFileChange(setFiles)

  /**
   * 处理上传过程
   */
  const handleUpload = useCallback(() => {
    simulateUpload(files, () => setFiles([]))
  }, [files, simulateUpload])

  /**
   * 清除选中的文件
   */
  const handleClearFiles = useCallback(() => {
    setFiles([])
  }, [])

  return (
    <div
      className="h-full flex items-center flex-col justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onDrop={(e) => handleDrop(e)}
      onDragOver={(e) => e.preventDefault()}
    >
      <Upload className="mx-auto h-20 w-20 text-gray-400" />
      <p className="mt-2">拖拽文件到这里或者点击上传</p>
      <input
        type="file"
        multiple
        onChange={(e) => handleFileChange(e)}
        className="hidden"
        ref={fileInputRef}
      />
      <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
        选择文件
      </Button>

      <FileUploadStatus
        files={files}
        uploading={uploading}
        progress={progress}
        onUpload={handleUpload}
        onClearFiles={handleClearFiles}
      />
    </div>
  )
}
