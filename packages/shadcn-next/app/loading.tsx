import { GithubIcon } from '@/components/custom/base/custom-icon'

export default function Loading() {
  return (
    <div className={`min-h-screen max-w-(--breakpoint-xl) mx-auto`}>
      <div className="w-full bg-background text-foreground dark:bg-slate-900">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto flex h-16 items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="h-8 w-8 animate-pulse rounded-full bg-muted"/>
              <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
            </div>
            <nav className="hidden md:block">
              <div className="flex gap-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="h-4 w-16 animate-pulse rounded bg-muted"/>
                ))}
              </div>
            </nav>
            <div className="flex items-center gap-4">
              <GithubIcon className="h-6 w-6 text-muted"/>
              <div className="h-6 w-6 animate-pulse rounded-full bg-muted"/>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-3xl space-y-8 text-center">
            <div className="mx-auto h-12 w-3/4 animate-pulse rounded bg-muted"/>
            <div className="space-y-4">
              <div className="mx-auto h-4 w-full animate-pulse rounded bg-muted"/>
              <div className="mx-auto h-4 w-5/6 animate-pulse rounded bg-muted"/>
            </div>
            <div className="flex justify-center gap-4">
              <div className="h-10 w-32 animate-pulse rounded-full bg-primary/20"/>
              <div className="h-10 w-32 animate-pulse rounded-full bg-muted"/>
            </div>
            <div className="flex justify-center gap-4">
              <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
              <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="container mx-auto px-4 py-16">
          <div className="mx-auto mb-12 max-w-xl text-center">
            <div className="mx-auto h-8 w-64 animate-pulse rounded bg-muted"/>
            <div className="mt-4 h-4 w-full animate-pulse rounded bg-muted"/>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[
              'bg-blue-100/50 dark:bg-blue-900/20',
              'bg-emerald-100/50 dark:bg-emerald-900/20',
              'bg-orange-100/50 dark:bg-orange-900/20',
              'bg-pink-100/50 dark:bg-pink-900/20',
              'bg-purple-100/50 dark:bg-purple-900/20',
              'bg-green-100/50 dark:bg-green-900/20',
            ].map((color, i) => (
              <div
                key={i}
                className={`rounded-xl ${color} p-6 transition-colors duration-200`}
              >
                <div className="space-y-4">
                  <div className="h-6 w-48 animate-pulse rounded bg-muted"/>
                  <div className="space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-muted"/>
                    <div className="h-4 w-5/6 animate-pulse rounded bg-muted"/>
                  </div>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted"/>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
