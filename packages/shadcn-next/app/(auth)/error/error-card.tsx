'use client'

import { useState } from 'react'
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
import { getUser } from '@/app/lib/user'
import { createClient } from '@/utils/supabase/client'
import { toast } from '@/components/ui/use-toast'

export function ErrorCard({ errorMessage }: { errorMessage: string }) {
  const [isResending, setIsResending] = useState(false)

  const handleResendEmail = async () => {
    setIsResending(true)

    const user = await getUser()
    const susabase = createClient()

    if (user) {
      console.log('User:', user)
      try {
        await susabase.auth.resend({
          type: 'signup',
          email: user.email as string,
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
          animate={{
            background: [
              'linear-gradient(to right, #3b82f6, #2563eb)',
              'linear-gradient(to right, #2563eb, #1d4ed8)',
              'linear-gradient(to right, #1d4ed8, #3b82f6)',
            ],
          }}
          transition={{ duration: 5, repeat: Infinity, repeatType: 'reverse' }}
        />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            注册失败
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 bg-white bg-opacity-90">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="mt-4 text-center text-gray-600">
            看起来您的确认链接已经过期或无效。不用担心，我们可以为您重新发送一封确认邮件。
          </p>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 relative z-10 bg-white bg-opacity-90">
          <Button
            onClick={handleResendEmail}
            disabled={isResending}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            {isResending ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                正在重新发送...
              </>
            ) : (
              '重新发送确认邮件'
            )}
          </Button>
          <div className="flex justify-between w-full">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                返回首页
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                登录
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
