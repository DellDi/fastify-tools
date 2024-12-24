import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  // 重要提示：避免在 createServerClient 和
  // supabase.auth.getUser() 的 API API 中。一个简单的错误可能会使调试变得非常困难
  // 用户被随机注销的问题。

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (
    !user &&
    !request.nextUrl.pathname.startsWith('/login') &&
    !request.nextUrl.pathname.startsWith('/api/auth/login')
  ) {
    // no user, potentially respond by redirecting the user to the login page
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

// 重要提示：您*必须*按原样返回 supabaseResponse 对象。如果你是
//   使用 NextResponse.next（） 创建新的响应对象，请确保：
//   // 1.在其中传递请求，如下所示：
//   const myNewResponse = NextResponse.next（{ 请求 }）
//   // 2.复制 Cookie，如下所示：
//   myNewResponse.cookies.setAll（supabaseResponse.cookies.getAll（））
//   // 3.更改 myNewResponse 对象以满足您的需要，但避免更改
//   饼干！
//   // 4.最后：
//   返回 myNewResponse
//   如果不这样做，可能会导致浏览器和服务器崩溃
//   sync 并提前终止用户的会话！
  return supabaseResponse
}
