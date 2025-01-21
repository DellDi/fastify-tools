'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  )
  const [message, setMessage] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const token = searchParams?.get('token')
    const error = searchParams?.get('error')

    if (error) {
      setStatus('error')
      setMessage('验证链接无效或已过期，请重新注册。')
      return
    }

    if (token) {
      verifyToken(token)
    } else {
      setStatus('loading')
      setMessage('请检查您的邮箱，点击验证链接完成注册。')
    }
  }, [searchParams])

  const verifyToken = async (token: string) => {
    try {
      const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
      const response = await fetch(
        `${BASE_API_URL}/auth/verify-magic-link?token=${token}`,
        {
          method: 'GET',
        }
      )
      const result = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('邮箱验证成功！')
        // 验证成功后延迟跳转到仪表板
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        throw new Error(result.error || '验证失败')
      }
    } catch (error) {
      setStatus('error')
      setMessage(
        error instanceof Error ? error.message : '验证失败，请重新注册。'
      )
      // 验证失败后延迟跳转到错误页面
      setTimeout(() => {
        router.push(
          `/error?message=${encodeURIComponent('邮箱验证失败，请重新注册。')}`
        )
      }, 2000)
    }
  }

  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>邮箱验证</CardTitle>
          <CardDescription>
            {status === 'loading' && '请等待验证完成'}
            {status === 'success' && '验证成功'}
            {status === 'error' && '验证失败'}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center space-y-4">
          {status === 'loading' && (
            <Icons.spinner className="h-8 w-8 animate-spin text-primary" />
          )}
          {status === 'success' && (
            <Icons.check className="h-8 w-8 text-green-500" />
          )}
          {status === 'error' && (
            <Icons.close className="h-8 w-8 text-red-500" />
          )}
          <p className="text-center text-sm text-muted-foreground">{message}</p>
        </CardContent>
      </Card>
    </div>
  )
}
