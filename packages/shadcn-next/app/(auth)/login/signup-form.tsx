'use client'

import * as z from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useRouter } from 'next/navigation'

const signUpSchema = z.object({
  username: z.string().min(3, { message: '用户名至少需要3个字符' }),
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  phoneNumber: z.string().regex(/^1[3-9]\d{9}$/, { message: '请输入有效的手机号码' }),
})

type SignUpFormValues = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onSignUpAction: (message: string) => void
  onSignUpErrorAction: (error: string) => void
}

export function SignUpForm({ onSignUpAction, onSignUpErrorAction }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      phoneNumber: '',
    },
  })

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true)
    try {
      const BASE_API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'
      const response = await fetch(`${BASE_API_URL}/auth/magic-link`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          purpose: 'registration',
        }),
      })
      const result = await response.json()
      if (response.ok) {
        onSignUpAction('验证邮件已发送到您的邮箱，请查收并点击链接完成注册。')
        localStorage.setItem('registrationEmail', data.email)
        router.push('/auth/verify-email')
      } else {
        throw new Error(result.error || '注册失败')
      }
    } catch (error) {
      onSignUpErrorAction(error instanceof Error ? error.message : '注册失败，请稍后再试。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>用户名</FormLabel>
              <FormControl>
                <Input placeholder="your_username" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>邮箱</FormLabel>
              <FormControl>
                <Input placeholder="your@email.com" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input placeholder="13800138000" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '发送验证邮件...' : '注册'}
        </Button>
      </form>
    </Form>
  )
}

