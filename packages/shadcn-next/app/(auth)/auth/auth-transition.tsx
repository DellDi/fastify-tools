'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { createClient } from '@/utils/supabase/client'
import { initUserStore } from '@/app/lib/user'
import { initRolePermission } from '@/app/lib/auth'

interface AuthTransitionProps {
  params: Record<string, string | undefined>
}


export default function AuthTransition({ params }: AuthTransitionProps) {
  const [status, setStatus] = useState<'base' | 'loading' | 'success' | 'error'>('base')
  const [message, setMessage] = useState('正在验证您的身份...')
  const router = useRouter()
  const { code, redirect } = params

  // 在某个地方定义这个函数，可能在同一个文件或一个工具文件中
  const handleError = useCallback((error: unknown, defaultMessage = '身份验证失败。请稍后重试') => {
    const errorMessage = error instanceof Error ? error.message : defaultMessage
    toast({
      title: '登录提示',
      description: errorMessage,
      variant: 'destructive',
    })
    setStatus('error')
    setMessage(`身份验证失败。请稍后重试: ${errorMessage}`)
    setTimeout(() => router.push('/error'), 1000)
  }, [router]) // 添加 router 作为依赖项

  const authCodeLogin = useCallback(async () => {
    if (!code) return

    setStatus('loading')
    setMessage('正在验证您的身份...')

    const supabase = createClient()
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        handleError(error, '授权登录失败！请重试')
        return
      }

      if (!data || !data.user) {
        handleError(new Error('用户信息不存在'), '授权登录失败！用户信息不存在')
        return
      }

      const res = await initRolePermission(data.user)
      if (res) {
        handleError(new Error('授权角色失败'), '授权角色失败')
        return
      }
      await initUserStore()

      setStatus('success')
      setMessage('身份验证成功！正在跳转...')
      setTimeout(() => router.push(redirect || '/dashboard'), 1000)
      return data.user
    } catch (error) {
      handleError(error) // 处理任何其他未预见的错误
    }
  }, [code, redirect, router, handleError]) // 注意添加 handleError 作为依赖项

  useEffect(() => {
    authCodeLogin().catch(() => {
      // Ignore error
    })
  }, [authCodeLogin])

  const iconVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.5 } },
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center bg-white dark:bg-gray-800 rounded-xl p-8 shadow-xl max-w-md w-full mx-4"
      >
        <motion.div
          variants={iconVariants}
          initial="hidden"
          animate="visible"
          className="mb-6"
        >
          {status === 'loading' && <Loader2 className="mx-auto h-16 w-16 text-blue-500 animate-spin"/>}
          {status === 'success' && <CheckCircle className="mx-auto h-16 w-16 text-green-500"/>}
          {status === 'error' && <XCircle className="mx-auto h-16 w-16 text-red-500"/>}
        </motion.div>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200 mb-4">身份验证</h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{message}</p>
        {Object.keys(params).length > 0 && (
          <div className="mb-6 text-left">
            <h3 className="text-lg font-semibold mb-2">URL 参数：</h3>
            <ul className="list-disc pl-5">
              {Object.entries(params).map(([key, value]) => (
                <li key={key} className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-medium">{key}:</span> {value}
                </li>
              ))}
            </ul>
          </div>
        )}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: status === 'loading' ? '100%' : 0 }}
          transition={{ duration: 3 }}
          className="h-1 bg-blue-500 rounded-full"
        />
      </motion.div>
    </div>
  )
}
