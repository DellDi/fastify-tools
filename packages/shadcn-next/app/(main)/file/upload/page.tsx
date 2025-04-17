import FileUploader from '@/components/upload/base-upload'

export default function DellUpload() {
  return (
    <div className="grid h-[calc(100vh-6rem)] w-full md:grid-cols-1 lg:grid-cols-1">
      <div className="flex flex-col flex-1">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">文件上传</h1>
          </div>
          <div
            className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-xs"
            x-chunk="dashboard-02-chunk-1"
          >
            <div className="flex flex-col items-center gap-1 text-center w-full h-full">
              <FileUploader/>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
