'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { AlertCircle, RefreshCw, Home, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { createClient } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { initRolePermission } from '@/app/lib/auth'

export function ErrorCard({ errorMessage, email }: { errorMessage: string, email: string }) {
  const [isResending, setIsResending] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    setUserEmail(email || (typeof window !== 'undefined' ? localStorage.getItem('rememberedEmail') : '') || 'delldi808611@outlook.com')
  }, [email])


  const handleResendEmail = async () => {
    setIsResending(true)
    const susabase = createClient()
    if (userEmail) {
      try {
        const resendInfo = await susabase.auth.resend({
          type: 'signup',
          email: userEmail,
        })
        console.log('🚀 ~ file:error-card.tsx, line:37-----', resendInfo)
        toast({
          title: '发送成功',
          description: '邮件已发送，请查收',
        })
      } catch (error) {
        toast({
          title: '发送失败',
          description: `${error}`,
          variant: 'destructive',
        })
      }
    } else {
      console.error('User not found')
      toast({
        title: '发送失败',
        description: '用户未找到',
        variant: 'destructive',
      })
    }
    setIsResending(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="w-full max-w-md overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold text-center ">
            <AlertCircle className="w-12 h-12 mx-auto mb-2"/>
            注册失败
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 ">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4"/>
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="mt-4 text-center ">
            看起来您的确认链接已经过期或无效。不用担心，我们可以为您重新发送一封确认邮件。
          </p>

          <Input className="mt-4" type="text" value={userEmail} onChange={(e) => setUserEmail(e.target.value)}
                 placeholder="请输入您的邮箱"/>
          <Button
            onClick={() => initRolePermission({
              id: '75713b4a-d386-452d-bc91-5bc2834d1f43',
              role: 'admin',
              aud: 'authenticated',
              app_metadata: {
                jwtVersion: 1,
              },
              created_at: '',
              user_metadata: {
                email: 'delldi808611@outlook.com',
              },
            })}
            disabled={isResending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            测试角色授权
          </Button>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 relative z-10 ">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full "
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin"/>
                正在重新发送...
              </>
            ) : (
              '重新发送确认邮件'
            )}
          </Button>
          <div className="flex justify-between w-full">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4"/>
                返回首页
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4"/>
                登录
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
