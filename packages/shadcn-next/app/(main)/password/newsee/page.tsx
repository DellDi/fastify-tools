import { PasswordComponent } from '@/components/password/handle'

export default function NewseePassword() {
  return (
    <div className="flex flex-col h-full">
      <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
        <div className="flex items-center">
          <h1 className="text-lg font-semibold md:text-2xl">密码中心</h1>
        </div>
        <div
          className="flex flex-1 rounded-lg border border-dashed shadow-sm"
          x-chunk="dashboard-02-chunk-1"
        >
          <div className="w-full items-center gap-1 text-center">
            <PasswordComponent/>
          </div>
        </div>
      </main>
    </div>
  )
}
