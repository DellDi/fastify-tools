'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from '@/hooks/use-toast'

const userSettingsSchema = z.object({
  username: z.string().min(3, { message: "用户名至少需要3个字符" }),
  email: z.string().email({ message: "请输入有效的邮箱地址" }),
  phone_number: z.string().regex(/^1[3-9]\d{9}$/, { message: "请输入有效的手机号码" }).optional().or(z.literal('')),
})

type UserSettingsFormValues = z.infer<typeof userSettingsSchema>

interface UserSettingsFormProps {
  user: UserSettingsFormValues
}

export function UserSettingsForm({ user }: UserSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const form = useForm<UserSettingsFormValues>({
    resolver: zodResolver(userSettingsSchema),
    defaultValues: {
      username: user.username,
      email: user.email,
      phone_number: user.phone_number || '',
    },
  })

  async function onSubmit(data: UserSettingsFormValues) {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const result = await response.json()
      if (response.ok) {
        toast({
          title: "设置更新成功",
          description: "您的个人信息已经更新。",
        })
      } else {
        throw new Error(result.error || "更新失败")
      }
    } catch (error) {
      toast({
        title: "更新失败",
        description: error instanceof Error ? error.message : "更新个人信息时出错，请稍后再试。",
        variant: "destructive",
      })
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
                <Input {...field} />
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="phone_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel>手机号码</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? '更新中...' : '更新设置'}
        </Button>
      </form>
    </Form>
  )
}

