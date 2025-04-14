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

import { toast } from '@/components/ui/use-toast'
import { Input } from '@/components/ui/input'
import { PinContainer } from '@/components/ui/3d-pin'

import { sendEmailVerification } from '@/app/lib/auth/register'
import { errorMessagesCodeMap } from '@/types/email'

export function ErrorCard({
  errorMessage,
  email,
  errorCode,
}: {
  errorMessage: string
  email: string
  errorCode: string
}) {
  const [isResending, setIsResending] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    setUserEmail(
      email ||
        (typeof window !== 'undefined'
          ? localStorage.getItem('rememberedEmail')
          : '') ||
        'delldi808611@outlook.com'
    )
  }, [email])

  const handleResendEmail = async () => {
    setIsResending(true)

    if (userEmail) {
      try {
        await sendEmailVerification(userEmail)

        toast({
          title: '发送成功',
          description: '邮件已重新发送，请查收',
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
    <>
      {/* <div className="h-[40rem] w-full flex items-center justify-center ">
        <PinContainer
          title="/ui.aceternity.com"
          href="https://twitter.com/mannupaaji"
        >
          <div className="flex basis-full flex-col p-4 tracking-tight text-slate-100/50 sm:basis-1/2 w-[20rem] h-[20rem] ">
            <h3 className="max-w-xs !pb-2 !m-0 font-bold  text-base text-slate-100">
              Aceternity UI
            </h3>
            <div className="text-base !m-0 !p-0 font-normal">
              <span className="text-slate-500 ">
                Customizable Tailwind CSS and Framer Motion Components.
              </span>
            </div>
            <div className="flex flex-1 w-full rounded-lg mt-4 bg-gradient-to-br from-violet-500 via-purple-500 to-blue-500" />
          </div>
        </PinContainer>
      </div> */}

      <Card className="overflow-hidden w-full sm:w-full xl:6/7 md:5/6 lg:w-4/5 max-w-xl">
        <motion.div
          className="absolute inset-0 z-0"
          transition={{
            duration: 5,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
        />
        <CardHeader className="relative z-10">
          <CardTitle className="text-2xl font-bold text-center ">
            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
            遇到了某些问题
          </CardTitle>
        </CardHeader>
        <CardContent className="relative z-10 ">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>错误</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
          </Alert>
          <p className="mt-4 text-center">
            {errorCode ===
              errorMessagesCodeMap.EMAIL_VERIFICATION_EXPIRED.code ||
              errorCode === errorMessagesCodeMap.EMAIL_NOT_VERIFIED.code ||
              (errorCode === errorMessagesCodeMap.EMAIL_EXISTS.code &&
                '看起来您的确认链接已经过期或无效。不用担心，可以重新发送一封确认邮件。')}
            {!errorCode && '未知错误，请重试。'}
          </p>

          <Input
            className="mt-4"
            type="text"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            placeholder="请输入您的邮箱"
          />
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4 relative z-10 ">
          {errorCode ===
            errorMessagesCodeMap.EMAIL_VERIFICATION_EXPIRED.code && (
            <Button
              onClick={handleResendEmail}
              disabled={isResending}
              className="w-full "
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
          )}

          <div className="flex justify-between w-full">
            <Button variant="outline" asChild>
              <Link href="/">
                <Home className="mr-2 h-4 w-4" />
                返回
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
    </>
  )
}
