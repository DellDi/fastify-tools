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
          setUploading(false)
          return 100
        }
        return prevProgress + 10
      })
    }, 500)
  }, [])

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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
            <Button onClick={simulateUpload} className="mt-4 w-full">
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
