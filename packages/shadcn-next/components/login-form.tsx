"use client"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation'

const FormSchema = z.object({
  email: z.string().email({ message: "请输入正确的邮箱账号" }),
  password: z.string().min(6, { message: "密码至少需要6个字符" })
});

export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter()

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const response = await fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      toast({
        title: "登录成功",
        description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                        <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                    </pre>
        ),
      });
      router.push('/dashboard')
    } else {
      toast({
        title: "登录失败",
        description: "无效的邮箱或密码",
      });
    }
  }

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "delldi808611@outlook.com",
      password: "123456"
    },
  });

  return (
      <Card className="mx-auto max-w-sm min-w-96">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>目前支持邮箱登录</CardDescription>
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
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormDescription>请输入你的邮箱地址</FormDescription>
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
                          <Input placeholder="******" {...field} />
                        </FormControl>
                        <FormDescription>请输入你的账户密码</FormDescription>
                        <FormMessage/>
                      </FormItem>
                  )}
              />
              <Button type="submit" className="w-full">登录</Button>
              <Button variant="outline" className="w-full">注册</Button>

              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
              </div>
            </form>
          </Form>

        </CardContent>
      </Card>
  );
}
