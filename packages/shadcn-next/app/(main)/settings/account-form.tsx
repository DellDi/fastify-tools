'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@/generated/client'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { fetchBase } from '@/utils/fetch/fetch'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useToast } from '@/components/ui/use-toast'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Icons } from '@/components/ui/icons'

const formSchema = z.object({
  username: z.string().min(2, {
    message: '用户名至少需要2个字符。',
  }),
  email: z.string().email({
    message: '请输入有效的邮箱地址。',
  }),
  phone: z.string().optional(),
  avatar: z.instanceof(File).optional(),
})

export default function AccountForm({ user }: { user: User }) {
  const [isLoading, setIsLoading] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    setPreviewUrl(user.avatarUrl || null)
  }, [user.avatarUrl])

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user.username || '',
      email: user.email || '',
      phone: user.phone || '',
    },
  })

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      form.setValue('avatar', file)
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      let avatarUrl = user.avatarUrl
      if (values.avatar) {
        const formData = new FormData()
        formData.append('file', values.avatar)

        const uploadResponse = await fetchBase('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) throw new Error('头像上传失败')

        const { url } = await uploadResponse.json()
        avatarUrl = url
      }

      const response = await fetchBase('/api/user', {
        method: 'PATCH',
        body: JSON.stringify({
          username: values.username,
          email: values.email,
          phone: values.phone,
          avatarUrl,
        }),
      })

      if (response.ok) {
        toast({
          title: '更新成功',
          description: '您的资料已保存',
        })
        router.refresh()
      } else {
        throw new Error('更新失败')
      }
    } catch (error) {
      toast({
        title: '错误',
        description: error instanceof Error ? error.message : '更新失败',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const {
    userCircle: UserCircle,
    ImageIcon: ImageIcon,
    spinner: Loader2,
  } = Icons

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="border-border/20 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-muted-foreground" />
              个人信息
            </CardTitle>
            <CardDescription>更新您的基本资料和偏好设置</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-2">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>用户名</FormLabel>
                    <FormControl>
                      <Input placeholder="your_name" {...field} />
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>电话</FormLabel>
                    <FormControl>
                      <Input readOnly placeholder="your_phone" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-border/10">
              <Avatar className="h-20 w-20">
                <AvatarImage src={previewUrl || ''} />
                <AvatarFallback>{user.username?.charAt(0)}</AvatarFallback>
              </Avatar>
              <FormField
                control={form.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel className="flex items-center gap-2">
                      <ImageIcon className="h-4 w-4" />
                      头像
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id="avatar-upload"
                        onChange={handleAvatarChange}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="outline"
                      className="mt-2"
                      onClick={() =>
                        document.getElementById('avatar-upload')?.click()
                      }
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      更换头像
                    </Button>
                    <FormDescription>
                      支持 JPG, PNG 格式，大小不超过 2MB
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
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
