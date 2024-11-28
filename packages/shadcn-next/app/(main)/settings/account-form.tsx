'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent } from "@/components/ui/card"
import { Icons } from "@/components/ui/icons"
import { createClient } from '@/utils/supabase/client'

const formSchema = z.object({
  username: z.string().min(2, {
    message: "用户名至少需要2个字符。",
  }),
  email: z.string().email({
    message: "请输入有效的邮箱地址。",
  }),
  avatar: z.instanceof(File).optional(),
})

export default function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const { toast } = useToast()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.user_metadata.username || '',
      email: user.email || '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      let avatarUrl = user.user_metadata.avatar_url

      if (values.avatar) {
        const fileExt = values.avatar.name.split('.').pop()
        const fileName = `${Math.random()}.${fileExt}`
        const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, values.avatar)

        if (uploadError) {
          throw uploadError
        }

        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(fileName)
        avatarUrl = urlData.publicUrl
      }

      const { error } = await supabase.auth.updateUser({
        email: values.email,
        data: { username: values.username, avatar_url: avatarUrl }
      })

      if (error) throw error

      toast({
        title: "更新成功",
        description: "您的账户信息已成功更新。",
      })

      router.refresh()
    } catch (error) {
      toast({
        title: "更新失败",
        description: "更新账户信息时出错，请稍后再试。",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="avatar"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>头像</FormLabel>
                  <FormControl>
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
                      <Avatar className="w-24 h-24 border-4 border-primary/20">
                        <AvatarImage src={user.user_metadata.avatar_url} />
                        <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                          {user.user_metadata.username?.charAt(0) || user.email?.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => field.onChange(e.target.files ? e.target.files[0] : null)}
                          className="cursor-pointer"
                        />
                        <p className="text-sm text-muted-foreground mt-2">
                          支持 JPG, PNG, GIF 格式，最大 5MB
                        </p>
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>
                      这是您的公开显示名称。
                    </FormDescription>
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
                    <FormDescription>
                      这是您的账户邮箱地址。
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <>
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              更新中...
            </>
          ) : (
            "更新账户信息"
          )}
        </Button>
      </form>
    </Form>
  )
}

