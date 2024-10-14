import Link from "next/link"
import { Package2, } from "lucide-react"
import { PasswordComponent } from "@/components/password/handle";

export default function NewseePassword() {
  return (
      <div className="grid h-[calc(100vh-6rem)] w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <div className="hidden border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
              <Link href="#" className="flex items-center gap-2 font-semibold">
                <Package2 className="h-6 w-6"/>
                <span className="">密码破译</span>
              </Link>
            </div>
            <div className="flex-1">
            </div>
          </div>
        </div>
        <div className="flex flex-col">
          <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
              <h1 className="text-lg font-semibold md:text-2xl">密码中心</h1>
            </div>
            <div
                className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm"
                x-chunk="dashboard-02-chunk-1"
            >
              <div className="flex flex-col items-center gap-1 text-center">
                <PasswordComponent/>
              </div>
            </div>
          </main>
        </div>
      </div>
  )
}
