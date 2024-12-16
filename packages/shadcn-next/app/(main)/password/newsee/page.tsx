import { PasswordComponent } from '@/components/password/handle'

export default function NewseePassword() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex  flex-col justify-start">
          <h1 className="text-lg font-semibold md:text-2xl">
            V10系统专用加解密工具
          </h1>
          <h3>
            符合新视窗特色的加密解密形式，支持多种加密方式，包括数据库字段加密、登录秘钥加密、附件加密等多种形式。
          </h3>
        </div>
        <div
          className="flex flex-1 rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="w-full items-center gap-1 text-center">
            <PasswordComponent />
          </div>
        </div>
      </main>
    </div>
  )
}
