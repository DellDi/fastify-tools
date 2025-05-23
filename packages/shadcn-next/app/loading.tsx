import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center space-x-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-6 w-24" />
          </div>

          <div className="hidden md:flex items-center space-x-6">
            {['Home', 'Features', 'Pricing', 'Blog'].map((item) => (
              <Skeleton key={item} className="h-5 w-16" />
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-24 rounded-md" />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container py-12 md:py-24">
        <div className="mx-auto max-w-3xl space-y-6 text-center">
          <Skeleton className="mx-auto h-12 w-3/4" />
          <Skeleton className="mx-auto h-6 w-1/2" />
          <div className="flex justify-center space-x-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-muted/50 py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-12">
            <div className="grid gap-8 md:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div key={item} className="space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12">
        <div className="container mx-auto max-w-4xl space-y-6 text-center">
          <Skeleton className="mx-auto h-10 w-1/2" />
          <Skeleton className="mx-auto h-6 w-1/3" />
          <div className="flex justify-center">
            <Skeleton className="h-12 w-40 rounded-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((i) => (
                    <Skeleton key={i} className="h-4 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 border-t pt-8">
            <div className="flex flex-col items-center justify-between md:flex-row">
              <Skeleton className="h-6 w-48" />
              <div className="mt-4 flex space-x-6 md:mt-0">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-6 w-6 rounded-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
