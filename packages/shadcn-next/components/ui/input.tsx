import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ResizableInputProps
  extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  as?: 'input' | 'textarea'
}

const Input = React.forwardRef<
  HTMLInputElement | HTMLTextAreaElement,
  ResizableInputProps
>(({ className, type, as = 'input', ...props }, ref) => {
  const handleTextareaResize = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    event.target.style.height = 'auto'
    event.target.style.height = `${event.target.scrollHeight}px`
  }

  if (as === 'textarea') {
    return (
      <textarea
        className={cn(
          'flex w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-y overflow-hidden',
          className,
        )}
        ref={ref as React.Ref<HTMLTextAreaElement>}
        onInput={handleTextareaResize}
        {...props}
      />
    )
  }

  return (
    <input
      type={type}
      className={cn(
        'flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      ref={ref as React.Ref<HTMLInputElement>}
      {...props}
    />
  )
})

Input.displayName = 'ResizableInput'

export { Input }
