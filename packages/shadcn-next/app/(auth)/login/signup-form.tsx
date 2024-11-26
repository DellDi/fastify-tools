'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useRouter } from 'next/navigation'

const signUpSchema = z.object({
  username: z.string().min(3, { message: "用户名至少需要3个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  password: z.string()
  .min(8, { message: "密码至少需要8个字符" })
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, {
    message: "密码需要包含至少一个大写字母、一个小写字母、一个数字和一个特殊字符",
  }),
  confirmPassword: z.string(),
  phoneNumber: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "密码不匹配",
  path: ["confirmPassword"],
})

type SignUpFormValues = z.infer<typeof signUpSchema>

interface SignUpFormProps {
  onSuccess: (message: string) => void
  onError: (error: string) => void
}

export function SignUpForm({ onSuccess, onError }: SignUpFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    },
  })

  async function onSubmit(data: SignUpFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        onSuccess(result.message)
        // Redirect to login page with email and password as query parameters
        router.push(`/auth?email=${encodeURIComponent(data.email)}&password=${encodeURIComponent(data.password)}`)
      } else {
        throw new Error(result.error || "注册失败")
      }
    } catch (error) {
      onError(error instanceof Error ? error.message : "注册失败，请稍后再试。")
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>密码</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
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
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '注册中...' : '注册'}
        </Button>
      </form>
    </Form>
  )
}

