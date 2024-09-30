"use client"

import Link from "next/link"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast";

const FormSchema = z.object({
  email: z.string().email({
    message: "请输入正确的邮箱账号",
  }),
  password: z.string().min(6, {
    message: "密码至少需要6个字符",
  })
})

export function LoginForm() {

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "登录成功",
      description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "delldi808611@outlook.com",
      password: "123456"
    },
  })
  return (
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="m@example.com"
                              {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          请输入你的邮箱地址
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                      <FormItem className="grid gap-2">
                        <FormLabel>密码</FormLabel>
                        <FormControl>
                          <Input
                              placeholder="******"
                              {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          请输入你的账户密码
                        </FormDescription>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <Button type="submit" className="w-full">
                {/*<Link href="/dashboard">*/}
                登录
                {/*</Link>*/}
              </Button>
              <Button variant="outline" className="w-full">
                微信
              </Button>
            </form>
          </Form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="#" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
  )
}
