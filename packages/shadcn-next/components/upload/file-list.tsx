import React from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CircleX } from 'lucide-react'
import { getFileIcon } from '@/lib/file'

interface FileUploadStatusProps {
  files: File[];
  uploading: boolean;
  progress: number;
  onUpload: () => void;
  onClearFiles: () => void;
}

export const FileUploadStatus: React.FC<FileUploadStatusProps> = ({
  files,
  uploading,
  progress,
  onUpload,
  onClearFiles,
}) => {
  return (
    <>
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">已选择的文件：</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 border-2 rounded-md dark:border-gray-700">
            {files.map((file, index) => (
              <div key={index} className="relative border rounded-lg p-2 flex flex-col items-center">
                {getFileIcon(file)}
                <div className="absolute -right-2 -top-2" onClick={onClearFiles}><CircleX/></div>
                <p className="mt-2 text-sm truncate w-full text-center">{file.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {files.length > 0 && !uploading && (
        <Button variant="destructive" onClick={onUpload} className="mt-4 space-y-2 max-w-sm">
          确认上传
        </Button>
      )}

      {uploading && (
        <div className="mt-4">
          <Progress value={progress} className="w-full"/>
          <p className="text-center mt-2">{progress}% 已上传</p>
        </div>
      )}
    </>
  )
}
