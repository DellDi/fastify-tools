import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export default function AuthLoading() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-background">
      <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-background to-muted/60" />
      <div className="pointer-events-none absolute left-[27%] top-3 h-20 w-px bg-linear-to-b from-primary via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute bottom-20 right-[18%] h-16 w-px bg-linear-to-b from-primary via-primary/60 to-transparent" />
      <div className="pointer-events-none absolute bottom-0 h-px w-full bg-border shadow-xs" />

      <Card className="relative z-10 w-[400px] max-w-[calc(100vw-2rem)]">
        <CardHeader>
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-10" />
            <Skeleton className="h-9 w-full" />
          </div>
          <div className="flex items-center gap-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-14" />
          </div>
          <Skeleton className="h-9 w-full" />

          <div className="space-y-4 pt-2">
            <Skeleton className="mx-auto h-4 w-24" />
            <Skeleton className="mx-auto h-4 w-20" />
          </div>

          <div className="pt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center">
                <Skeleton className="h-4 w-32 bg-background" />
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
