import { File as FileIcon, FileAudio, FileVideo, Image } from 'lucide-react'

export function getFileIcon(file: File) {
  if (file.type.startsWith('image/')) return <Image className="w-12 h-12 text-blue-500"/>
  if (file.type.startsWith('audio/')) return <FileAudio className="w-12 h-12 text-green-500"/>
  if (file.type.startsWith('video/')) return <FileVideo className="w-12 h-12 text-red-500"/>
  return <FileIcon className="w-12 h-12 text-gray-500"/>
}
    
