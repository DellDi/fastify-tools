'use client'

import { Button, type ButtonProps } from '@/components/ui/button'
import { toast } from '@/components/ui/use-toast'
import { Clipboard, ClipboardCheck } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface CopyButtonProps extends ButtonProps {
  text: string
}

export function CopyButton({ text, className = '', ...props }: CopyButtonProps) {
  const [isCopy, setIsCopy] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // alert('Copied to clipboard!')
      toast({
        title: 'Copied to clipboard!',
        description: 'You can now paste it anywhere you like.',
      })
      setIsCopy(true)
    } catch (error) {
      console.error('Failed to copy text: ', error)
      setIsCopy(false)
    }
  }
  return (
    <Button
      onClick={copyToClipboard}
      variant="ghost"
      className={cn({ className })}
      {...props}
    >
      {isCopy ? <ClipboardCheck/> : <Clipboard/>}
      {props.children}
    </Button>
  )
}
