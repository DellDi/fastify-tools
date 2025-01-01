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
  const [effectExecuted, setEffectExecuted] = useState(false)
  const [status, setStatus] = useState<'base' | 'loading' | 'success' | 'error'>('base')
  const [message, setMessage] = useState('正在验证您的身份...')
  const router = useRouter()

  const authCodeLogin = useCallback(async () => {
    const code = params.code
    if (code) {
      setStatus('loading') // 在开始请求前设置 loading 状态
      setMessage('正在验证您的身份...')
      try {
        const supabase = createClient()
        const { data, error } = await supabase.auth.exchangeCodeForSession(code)
        if (error) {
          toast({
            title: '登录提示',
            description: '授权登录失败！请重试',
            variant: 'destructive',
          })
          throw error
        }

        if (data && data.user) { // 确保 data 和 data.user 都存在
          // 分配权限
          await initRolePermission(data.user)
          // 初始化用户信息
          await initUserStore()
          setStatus('success')
          setMessage('身份验证成功！正在跳转...')
          setTimeout(() => router.push(params.redirect || '/dashboard'), 1000)
          return data.user
        } else {
          // 处理data或者data.user不存在的情况
          toast({
            title: '登录提示',
            description: '授权登录失败！用户信息不存在',
            variant: 'destructive',
          })
          throw new Error('用户信息不存在')
        }
      } catch (error) {
        setStatus('error')
        setMessage(`身份验证失败。请稍后重试:${error}`)
        setTimeout(() => router.push('/error'), 1000)
        throw error // 重新抛出错误，以便调用者进行进一步处理
      }
    }
  }, [params.code, params.redirect, router]) // 移除 status 依赖项

  useEffect(() => {
    if (effectExecuted) return

    setEffectExecuted(true)
    authCodeLogin().then(() => {
    }).catch(() => {
    })
  }, [authCodeLogin, params, effectExecuted])

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

