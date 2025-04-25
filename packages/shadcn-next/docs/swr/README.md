# SWR 数据获取最佳实践

> SWR 是一个用于数据获取的 React Hooks 库，名称来自 "stale-while-revalidate"（过期时重新验证）缓存策略。

## 目录

- [基本概念](#基本概念)
- [使用场景](#使用场景)
- [项目集成](#项目集成)
- [自定义 Hooks](#自定义-hooks)
- [进阶用法](#进阶用法)
- [性能优化](#性能优化)
- [常见问题](#常见问题)

## 基本概念

SWR 的核心理念是"先使用缓存数据（stale），然后发送请求获取最新数据（revalidate）"，这种策略在提供即时反馈的同时确保数据最终保持最新。

### 核心特性

- **自动缓存和重新验证**：智能缓存机制，自动更新过期数据
- **自动错误重试**：网络错误时自动重试，可配置重试策略
- **自动更新策略**：窗口聚焦、网络恢复时自动更新数据
- **乐观更新**：先更新 UI，后台验证，提供流畅体验
- **分页和无限滚动**：内置支持复杂的数据获取模式

## 使用场景

### 适合使用 SWR 的场景

✅ **客户端组件中的数据获取**
- 交互式界面（仪表板、个人资料等）
- 需要实时更新的数据（通知、消息等）
- 用户操作后需要刷新的数据（提交表单后）
- 多组件共享相同数据的情况

```tsx
'use client'
import { useFastApi } from '@/hooks/useFetch'

export function UserDashboard() {
  const { data, isLoading } = useFastApi('/users/stats')
  return isLoading ? <Spinner /> : <UserStats data={data} />
}
```

### 不适合使用 SWR 的场景

❌ **服务端组件中的数据获取**
- 页面初始加载时的数据获取
- SEO 关键内容的渲染
- 不需要客户端交互的静态内容

```tsx
// 服务端组件中，直接使用 fetch 更高效
export default async function ProductPage() {
  const products = await fetch('/api/products').then(res => res.json())
  return <ProductList products={products} />
}
```

❌ **服务端 API 路由内部调用**
- API 路由处理函数内
- 服务端操作函数内
- 数据库交互层

```tsx
// API 路由中直接使用基础 fetch 函数
export async function GET() {
  const data = await fetchFastApi('/external/data')
  return Response.json(data)
}
```

## 项目集成

### 全局配置

我们在 `app/providers.tsx` 中设置了全局 SWR 配置：

```tsx
<SWRConfig 
  value={{
    revalidateOnFocus: false,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    onError: (error) => {
      console.error('全局数据获取错误:', error)
    }
  }}
>
  {/* 其他提供器和子组件 */}
</SWRConfig>
```

### 自定义 Fetch 函数

我们为不同的 API 服务创建了专用的 fetch 函数和 SWR fetcher：

- `fetchFastApi` / `fastApiSWRFetcher` - 用于 FastAPI 服务
- `fastifyFetch` / `fastifySWRFetcher` - 用于 Fastify 服务
- `fetchBase` / `nextSWRFetcher` - 用于 Next.js API 路由

这些函数自动处理服务端/客户端环境差异，确保在任何环境中都能正确工作。

## 自定义 Hooks

我们创建了一系列自定义 hooks 简化数据获取：

```tsx
// 调用 FastAPI 服务
const { data, error, isLoading } = useFastApi('/users/profile')

// 调用 Fastify 服务（带参数）
const { data } = useFastify('/products', { limit: 10, category: 'electronics' })

// 调用 Next.js API 路由（带配置）
const { data, mutate } = useNextApi('/api/dashboard', undefined, {
  refreshInterval: 30000  // 30秒自动刷新
})
```

### 类型支持

所有 hooks 都支持泛型类型参数，可以指定返回数据的类型：

```tsx
interface User {
  id: number
  name: string
  email: string
}

// 指定返回数据类型
const { data } = useFastApi<User>('/users/1')

// TypeScript 会自动推断 data 的类型为 User | undefined
console.log(data?.name)
```

## 进阶用法

### 条件请求

只有当特定条件满足时才发起请求：

```tsx
// 只有当 userId 存在时才请求用户数据
const { data } = useFastApi(userId ? `/users/${userId}` : null)
```

### 依赖请求

一个请求依赖于另一个请求的结果：

```tsx
const { data: user } = useNextApi('/api/user')
// 只有当用户数据加载完成且有 teamId 时才请求团队数据
const { data: team } = useNextApi(user?.teamId ? `/api/teams/${user.teamId}` : null)
```

### 乐观更新

在请求完成前更新 UI，提供即时反馈：

```tsx
import { mutate } from 'swr'

async function updateUsername(newName) {
  // 1. 立即更新本地数据
  mutate('/api/user', { ...currentUser, name: newName }, false)
  
  // 2. 发送请求更新服务器
  await fetchBase('/api/user', {
    method: 'PATCH',
    body: JSON.stringify({ name: newName })
  })
  
  // 3. 触发重新验证（可选）
  mutate('/api/user')
}
```

### 分页和无限滚动

处理大型数据集和无限滚动列表：

```tsx
import { useSWRInfinite } from 'swr'
import { nextSWRFetcher } from '@/utils/fetch/fetch'

function InfiniteUserList() {
  const { data, size, setSize, isLoading } = useSWRInfinite(
    (index) => `/api/users?page=${index + 1}&limit=10`,
    nextSWRFetcher
  )
  
  // 扁平化所有页面的数据
  const users = data ? data.flat() : []
  
  return (
    <div>
      <List users={users} />
      <button onClick={() => setSize(size + 1)} disabled={isLoading}>
        {isLoading ? '加载中...' : '加载更多'}
      </button>
    </div>
  )
}
```

## 性能优化

### 去重和缓存

SWR 自动对相同的请求进行去重和缓存，避免重复请求：

```tsx
// 这两个组件使用相同的 key，SWR 只会发起一次请求
function ComponentA() {
  const { data } = useNextApi('/api/data')
  return <div>{data}</div>
}

function ComponentB() {
  const { data } = useNextApi('/api/data')
  return <div>{data}</div>
}
```

### 预加载数据

在用户可能需要数据之前预加载：

```tsx
import { preload } from 'swr'
import { nextSWRFetcher } from '@/utils/fetch/fetch'

// 在用户悬停在链接上时预加载数据
function ProductLink({ id, name }) {
  return (
    <a
      href={`/products/${id}`}
      onMouseEnter={() => {
        // 预加载产品详情
        preload(`/api/products/${id}`, nextSWRFetcher)
      }}
    >
      {name}
    </a>
  )
}
```

## 常见问题

### 1. 服务端渲染与水合问题

**问题**: 服务端渲染时 SWR 会尝试获取数据，可能导致水合不匹配。

**解决方案**: 
- 使用 `suspense: false` 选项（我们的自定义 hooks 中已默认设置）
- 在 `providers.tsx` 中配置全局 SWR 行为
- 对于 API 路由，在服务端环境中跳过请求（我们的 fetcher 已处理）

### 2. 数据更新不及时

**问题**: 有时数据更新后界面没有立即反映变化。

**解决方案**:
- 使用 `mutate` 函数手动触发重新验证
- 调整 `revalidateOnFocus` 和 `refreshInterval` 配置
- 检查缓存键是否正确（确保使用相同的键进行更新）

### 3. 类型错误

**问题**: TypeScript 类型推断不正确。

**解决方案**:
- 使用泛型参数明确指定返回类型：`useFastApi<User>('/api/user')`
- 创建接口或类型定义描述 API 响应
- 使用类型断言处理复杂情况

### 4. 性能问题

**问题**: 大量组件使用 SWR 可能导致性能问题。

**解决方案**:
- 调整 `dedupingInterval` 减少重复请求
- 使用 `useSWRImmutable` 对不经常变化的数据
- 合理设置缓存键，避免不必要的重新渲染

## 参考资源

- [SWR 官方文档](https://swr.vercel.app/zh-CN)
- [Next.js 数据获取文档](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [项目自定义 Hooks 文档](/hooks/README.md)
