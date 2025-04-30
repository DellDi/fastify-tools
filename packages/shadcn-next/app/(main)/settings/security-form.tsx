'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useToast } from '@/components/ui/use-toast'
import { Icons } from '@/components/ui/icons'
import { fetchBase } from '@/utils/fetch/fetch'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { useRouter } from 'next/navigation'

const formSchema = z
  .object({
    email: z.string().email({
      message: '请输入有效的邮箱地址。',
    }),
    emailCode: z
      .string()
      .min(6, {
        message: '验证码必须为6位数字。',
      })
      .optional(),
    password: z.string().min(8, {
      message: '密码至少需要8个字符。',
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: '密码不匹配',
    path: ['confirmPassword'],
  })

export default function SecurityForm({ user }: { user: any }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [emailCodedown, setEmailCodedown] = useState(0)
  const [emailSent, setEmailSent] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (emailCodedown > 0) {
      interval = setInterval(() => {
        setEmailCodedown((prev) => prev - 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [emailCodedown])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: user.email || '',
      emailCode: '',
      password: '',
      confirmPassword: '',
    },
  })

  const sendEmailCode = async () => {
    try {
      await fetchBase(`/api/auth/verify?email=${form.getValues('email')}`, {
        method: 'GET',
      })

      setEmailSent(true)
      setEmailCodedown(60)
      toast({
        title: '验证码已发送',
        description: '验证码已发送到您的邮箱，请查收。',
      })
    } catch (error) {
      toast({
        title: '发送失败',
        description: '发送验证码时出错，请稍后再试。',
        variant: 'destructive',
      })
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    if (values.password !== values.confirmPassword) {
      toast({
        title: '更新失败',
        description: '两次输入的密码不一致',
        variant: 'destructive',
      })
      setIsLoading(false)
      return
    }

    try {
      await fetchBase('/api/user/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
      })

      toast({
        title: '更新成功',
        description: '您的安全设置已更新, 请重新登录',
      })

      router.push('/login')
    } catch (error) {
      toast({
        title: '更新失败',
        description:
          error instanceof Error ? error.message : '更新安全设置时出错',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const { alertCircle: AlertCircle, shield: Shield, spinner: Loader2 } = Icons

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/20 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Shield className="h-5 w-5 text-muted-foreground" />
              账户安全
            </CardTitle>
            <CardDescription>
              保护您的账户安全，防止未经授权的访问
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱</FormLabel>
                  <FormControl>
                    <Input
                      readOnly
                      placeholder="your_email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emailCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>邮箱验证码</FormLabel>
                  <div className="flex gap-2">
                    <FormControl>
                      <Input placeholder="请输入6位验证码" {...field} />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendEmailCode}
                      disabled={emailCodedown > 0 || !form.getValues('email')}
                    >
                      {emailCodedown > 0
                        ? `${emailCodedown}秒后重试`
                        : emailSent
                        ? '已发送'
                        : '获取验证码'}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>新密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>确认密码</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <div className="p-4 border-t border-border/10">
            <h3 className="flex items-center gap-2 text-sm font-medium mb-4">
              <AlertCircle className="h-4 w-4" />
              安全提示
            </h3>
            <p className="text-sm text-muted-foreground">
              请定期更新您的密码，并确保使用强密码组合。
            </p>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            type="button"
            className="border-border/30 hover:bg-muted/20"
          >
            取消
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
            className="bg-primary/90 hover:bg-primary"
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            保存更改
          </Button>
        </div>
      </form>
    </Form>
  )
}
