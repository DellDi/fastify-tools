import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-none border-2 border-border bg-muted shadow-[3px_3px_0_hsl(var(--shadow-brutal))]", className)}
      {...props}
    />
  )
}

export { Skeleton }
