import { FilePlus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import React, { useCallback, useRef, useState } from 'react'
import {
  FileSuccessResponse,
  useHandleFileChange,
  useHandlePaste,
  useUploadProgress,
} from '@/hooks/use-file'
import { FileUploadStatus } from '@/components/upload/file-list'
import { toast } from '@/components/ui/use-toast'
import { fastifyFetch } from '@/utils/fetch/fastifyFetch'

/**
 * 单文件上传函数
 * @param {File[]} files - 要上传的文件数组
 * @returns {Promise<void>}
 */
const singleUploadFunction = async (files: File[]): Promise<void> => {
  const formData = new FormData()
  files.forEach((file) => {
    formData.append('file', file)
  })

  // 上传新增秒传逻辑，增加hash校验
  const hash = await crypto.subtle.digest(
    'SHA-256',
    await files[0].arrayBuffer()
  )
  const hashArray = Array.from(new Uint8Array(hash))
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
  const orgHash = hashHex.slice(0, 8)

  const resHashCheck = await fastifyFetch(`/upload/check`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      filename: files[0].name,
      fileHash: orgHash,
    }),
  })

  const resHashCheckJson = resHashCheck
  if (resHashCheckJson.isExist) {
    toast({
      title: '秒传成功',
      description: `文件已存在，文件名为${resHashCheckJson.extantFilename}`,
    })
    return
  }

  try {
    const res = await fastifyFetch(`/upload/single`, {
      method: 'POST',
      body: formData,
    })
    if (res.ok) {
      const fileInfo: FileSuccessResponse = res
      toast({
        title: '上传成功',
        description: `${fileInfo.fileUrl}`,
      })
    } else {
      const err = res
      toast({
        title: '上传失败',
        description: `${err.message}`,
      })
    }
  } catch (e) {
    toast({
      title: '上传失败',
      description: `请稍后再试${e}`,
    })
  }
}

/**
 * 单文件上传组件
 * @component
 */
export function SingleUpload() {
  // 文件状态
  const [files, setFiles] = useState<File[]>([])
  // 文件输入引用
  const fileInputRef = useRef<HTMLInputElement>(null)
  // 上传进度和状态
  const { progress, uploading, simulateUpload } =
    useUploadProgress(singleUploadFunction)
  // 处理粘贴事件
  const handlePaste = useHandlePaste(setFiles)
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
      className="h-full flex items-center flex-col justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors"
      onPaste={(e) => handlePaste(e)}
    >
      <FilePlus className="mx-auto h-20 w-20 text-gray-400" />
      <p className="mt-2">点击这里上传单个文件或粘贴文件</p>
      <input
        type="file"
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
