import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex h-screen w-full bg-background">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r bg-card">
        <div className="flex h-16 items-center border-b px-6">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="ml-2 h-6 w-32" />
        </div>
        <nav className="flex-1 space-y-1 p-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center space-x-3 rounded-md p-3 hover:bg-accent">
              <Skeleton className="h-5 w-5 rounded-sm" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="flex h-16 items-center justify-between border-b px-6">
          <div className="flex items-center space-x-4">
            <Skeleton className="md:hidden h-8 w-8 rounded" />
            <div className="hidden md:flex space-x-2">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-48 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          <div className="mb-6">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="mt-2 h-4 w-64" />
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border p-6">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-6 rounded-md" />
                </div>
                <Skeleton className="mt-2 h-8 w-16" />
                <Skeleton className="mt-2 h-3 w-20" />
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="rounded-lg border">
            <div className="flex items-center justify-between border-b p-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-10 w-32 rounded-md" />
            </div>
            <div className="p-4">
              <div className="mb-4 grid grid-cols-6 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-4 w-full" />
                ))}
              </div>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((row) => (
                  <div key={row} className="grid grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((cell) => (
                      <Skeleton key={cell} className="h-4 w-full" />
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <div className="flex space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-8 w-8 rounded" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
