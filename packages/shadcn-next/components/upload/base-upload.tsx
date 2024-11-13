'use client'

import React, { useCallback, useRef, useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { CircleX, File, Upload } from 'lucide-react'
import { getFileIcon } from '@/libs/file'
import { SingleUpload } from '@/components/upload/single'
import { BatchUpload } from '@/components/upload/batch'

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
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
    <div className="container mx-auto p-4 min-w-full h-full">
      <Card className="w-full h-full">
        <CardContent className="p-6 h-full flex flex-col">
          <Tabs defaultValue="single" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="single">单个上传</TabsTrigger>
              <TabsTrigger value="multiple">批量上传</TabsTrigger>
              <TabsTrigger value="large">大文件上传</TabsTrigger>
            </TabsList>

            <TabsContent value="single" className="grow">
              <SingleUpload/>
            </TabsContent>

            <TabsContent value="multiple" className="grow">
              <BatchUpload/>
            </TabsContent>

            <TabsContent value="large" className="grow">
              <div
                className="h-full flex items-center flex-col justify-center border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <Upload className="mx-auto h-12 w-12 text-gray-400"/>
                <p className="mt-1">选择大文件上传</p>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button onClick={() => fileInputRef.current?.click()} className="mt-4">
                  选择文件
                </Button>
              </div>
            </TabsContent>
          </Tabs>

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
        </CardContent>
      </Card>
    </div>
  )
}
