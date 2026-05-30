'use client'

import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import { useActionState } from 'react'
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
import { Checkbox } from '@/components/ui/checkbox'
import { useSearchParams } from 'next/navigation'
import { loginAction, type LoginState } from '@/app/actions/auth-actions'

const loginSchema = z.object({
  email: z.string().email({ message: '请输入有效的邮箱地址' }),
  password: z.string().min(1, { message: '请输入密码' }),
  rememberMe: z.boolean().optional(),
})

type LoginFormValues = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSuccessAction: (message: string) => void
  onErrorAction: (error: string) => void
}

/** 提交按钮内部组件，用于获取 pending 状态 */
function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? '登录中...' : '登录'}
    </Button>
  )
}

export function LoginForm({ onSuccessAction, onErrorAction }: LoginFormProps) {
  const searchParams = useSearchParams()

  const [state, formAction] = useActionState(loginAction, null)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams?.get('email') || '',
      password: searchParams?.get('password') || '',
      rememberMe: false,
    },
  })

  // 处理 Server Action 返回的错误结果
  // 成功时 redirect() 会直接跳转，不会走到这里
  useEffect(() => {
    if (!state) return
    if (state.success) {
      onSuccessAction(state.message)
    } else {
      onErrorAction(state.message)
    }
  }, [state, onSuccessAction, onErrorAction])

  // URL 参数回填
  useEffect(() => {
    const email = searchParams?.get('email')
    const password = searchParams?.get('password')
    if (email && password) {
      form.setValue('email', email)
      form.setValue('password', password)
    }
  }, [searchParams, form])

  // 表单提交：react-hook-form 验证通过后，将数据转为 FormData 交给 Server Action
  function handleSubmit(data: LoginFormValues) {
    // 记住我
    if (data.rememberMe) {
      localStorage.setItem('rememberedEmail', data.email)
    } else {
      localStorage.removeItem('rememberedEmail')
    }

    const formData = new FormData()
    formData.append('email', data.email)
    formData.append('password', data.password)
    formAction(formData)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
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
          name="rememberMe"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>记住我</FormLabel>
              </div>
            </FormItem>
          )}
        />
        <SubmitButton />
      </form>
    </Form>
  )
}
