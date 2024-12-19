import React from 'react'
import github from '@/public/svg/github.svg'
import Image from 'next/image'
import { cn } from '@/utils/utils'

// Create a React component for the GitHub icon
export function GithubIcon({ className }: { className?: string }) {
  return (
    <Image src={github} alt="GitHub Icon" className={cn(className)}/>
  )
}
