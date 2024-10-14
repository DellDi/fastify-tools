import { CircleX, File, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import React, { useCallback, useRef, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { getFileIcon } from "@/lib/file";

export function SingleUpload() {
  const [files, setFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData.files.length > 0) {
      setFiles(Array.from(e.clipboardData.files))
    }
  }, [])

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
      e.target.value = ''; // Reset the input value
    }
  }, [])

  const simulateUpload = useCallback(() => {
    setUploading(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
        }
        // 调整逻辑以模拟上传进度，最终无限接近100
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
    // 使用 fetch 上传文件
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('file', file)
    })
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/upload/single`, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json()).then((data) => {
      console.log(data)
      if (data.fileHash) {
        setProgress(100)
        setFiles([])
        setUploading(false)
        clearInterval(interval)
      }
    }).catch((err) => {
      console.error(err)
      clearInterval(interval)
      setUploading(false)
    })
  }, [files])

  return (
      <div
          className="h-full flex items-center flex-col justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          onPaste={handlePaste}
      >
        <FilePlus className="mx-auto h-20 w-20 text-gray-400"/>
        <p className="mt-2">点击这里上传单个文件或粘贴文件</p>
        <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            ref={fileInputRef}
        />
        <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
          选择文件
        </Button>

        {files.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">已选择的文件：</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border-2 rounded-md">
                {files.map((file, index) => (
                    <div key={index} className="relative border rounded-lg p-2 flex flex-col items-center">
                      {getFileIcon(file)}
                      <div className="absolute -right-2 -top-2" onClick={(e) => setFiles([])}><CircleX/></div>
                      <p className="mt-2 text-sm truncate w-full text-center">{file.name}</p>
                    </div>
                ))}
              </div>
            </div>
        )}

        {files.length > 0 && !uploading && (
            <Button variant="destructive" onClick={simulateUpload} className="mt-4 space-y-2 max-w-sm">
              确认上传
            </Button>
        )}

        {uploading && (
            <div className="mt-4">
              <Progress value={progress} className="w-full"/>
              <p className="text-center mt-2">{progress}% 已上传</p>
            </div>
        )}
      </div>
  )

}
