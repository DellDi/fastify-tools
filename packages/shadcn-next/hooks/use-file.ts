import React, { useState, useCallback } from 'react'

/**
 * 处理粘贴事件的自定义钩子
 * @param {React.Dispatch<React.SetStateAction<File[]>>} setFiles - 设置文件状态的函数
 * @returns {function} 处理粘贴事件的回调函数
 */
export function useHandlePaste(setFiles: React.Dispatch<React.SetStateAction<File[]>>): Function {
  return useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      setFiles(Array.from(e.clipboardData.files))
    }
  }, [setFiles])
}

/**
 * 处理文件改变事件的自定义钩子
 * @param {React.Dispatch<React.SetStateAction<File[]>>} setFiles - 设置文件状态的函数
 * @returns {function} 处理文件改变事件的回调函数
 */
export function useHandleFileChange(setFiles: React.Dispatch<React.SetStateAction<File[]>>): Function {
  return useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      e.target.value = '' // 重置输入值
    }
  }, [setFiles])
}

/**
 * 处理拖拽事件的自定义钩子
 * @param {React.Dispatch<React.SetStateAction<File[]>>} setFiles - 设置文件状态的函数
 * @returns {function} 处理拖拽事件的回调函数
 */
export function useHandleDrop(setFiles: React.Dispatch<React.SetStateAction<File[]>>): Function {
  return useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files) {
      setFiles(Array.from(e.dataTransfer.files))
    }
  }, [setFiles])
}

/**
 * 管理上传进度的自定义钩子
 * @param {function} uploadFunction - 上传文件的函数 包含进度、上传状态和模拟上传函数的对象
 */
export function useUploadProgress(uploadFunction: (files: File[]) => Promise<void>) {
  const [progress, setProgress] = useState(0)
  const [uploading, setUploading] = useState(false)

  /**
   * 模拟上传过程
   * @param {File[]} files - 要上传的文件数组
   * @param {function} onComplete - 上传完成后的回调函数
   */
  const simulateUpload = useCallback((files: File[], onComplete: () => void) => {
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          onComplete()
        }
        if (prevProgress >= 95) {
          return prevProgress + 0.1
        }
        if (prevProgress >= 80) {
          return prevProgress + 1
        }
        if (prevProgress >= 50) {
          return prevProgress + 2
        }
        return prevProgress + 5
      })
    }, 100)

    uploadFunction(files)
    .then(() => {
      setProgress(100)
      setUploading(false)
      clearInterval(interval)
    })
    .catch((err) => {
      console.error(err)
      clearInterval(interval)
      setUploading(false)
    })
  }, [uploadFunction])

  return { progress, uploading, simulateUpload }
}

/**
 * 文件上传成功响应接口
 */
export interface FileSuccessResponse {
  message: string
  fileUrl: string
  fileHash: string
}

/**
 * 批量文件上传成功响应接口
 */
export interface FileBatchSuccessResponse {
  message: string
  files: FileSuccessResponse[]
}
