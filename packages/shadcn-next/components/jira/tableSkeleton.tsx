import { Skeleton } from '@/components/ui/skeleton'

export function InvoicesTableSkeleton ({ pageSize }: { pageSize: number }) {
  return (
    <div className="space-y-4 w-full">
      {[...Array(pageSize)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4 w-full">
          <Skeleton className="h-20 w-20 rounded-full"/>
          <div className="space-y-2 flex-1">
            <Skeleton className="h-6 w-full"/>
            <Skeleton className="h-6 w-3/4"/>
          </div>
        </div>
      ))}
    </div>
  )
}
