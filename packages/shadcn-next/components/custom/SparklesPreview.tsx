'use client'
import React from 'react'
import { SparklesCore } from '@/components/ui/sparkles'
import { AuroraText } from '@/components/magicui/aurora-text'

export function SparklesPreview() {
  return (
    <div className="w-full flex flex-col items-center justify-center overflow-hidden rounded-md">
      <h1 className="md:text-6xl text-5xl lg:text-7xl font-bold text-center relative z-20 ">
        <AuroraText>A FULL STACK AI DEVELOPER</AuroraText>
      </h1>
      <div className="w-full h-20 relative">
        {/* Gradients */}
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-[2px] w-3/4 blur-sm" />
        <div className="absolute inset-x-20 top-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent h-px w-3/4" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-[5px] w-1/4 blur-sm" />
        <div className="absolute inset-x-60 top-0 bg-gradient-to-r from-transparent via-sky-500 to-transparent h-px w-1/4" />

        {/* Core component */}
        <SparklesCore
          background="transparent"
          minSize={1}
          maxSize={2}
          particleDensity={1200}
          className="w-full h-full"
          particleColor="#ddd"
        />

        {/* Radial Gradient to prevent sharp edges */}
        <div className="absolute inset-0 w-full h-full [mask-image:radial-gradient(350px_200px_at_top,transparent_20%,white)]"></div>
      </div>
    </div>
  )
}
