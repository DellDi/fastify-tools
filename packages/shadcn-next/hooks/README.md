# 数据获取 Hooks

本目录包含用于数据获取的自定义 React Hooks，基于 SWR 实现，提供更简洁、高效的数据获取方式。

## 核心功能

- 自动处理服务端/客户端环境差异
- 智能缓存与请求去重
- 自动数据更新策略
- 简化的状态管理
- 类型安全的 API 调用

## 使用示例

### 基本用法

```tsx
import { useFastApi, useFastify, useNextApi } from '@/hooks/useFetch'

// 调用 FastAPI 服务
function UserProfile() {
  const { data, error, isLoading } = useFastApi('/users/profile')
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>
  
  return <div>{data.name}</div>
}

// 调用 Fastify 服务
function ProductList() {
  const { data } = useFastify('/products', { limit: 10, category: 'electronics' })
  
  return (
    <ul>
      {data?.map(product => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  )
}

// 调用 Next.js API 路由
function Dashboard() {
  const { data, mutate } = useNextApi('/api/dashboard/stats')
  
  const refreshData = () => {
    mutate() // 手动触发重新验证
  }
  
  return (
    <div>
      <button onClick={refreshData}>刷新</button>
      <div>总访问量: {data?.totalVisits}</div>
    </div>
  )
}
```

### 高级用法

```tsx
// 带参数的 POST 请求
const { data, error } = useFastApi('/auth/login', { 
  username: 'user', 
  password: 'pass' 
}, {
  method: 'POST',
  onSuccess: (data) => {
    // 登录成功后的处理
  }
})

// 条件请求
const { data } = useNextApi(
  shouldFetch ? '/api/data' : null
)

// 轮询数据
const { data } = useFastify('/status', undefined, {
  refreshInterval: 3000 // 每 3 秒刷新一次
})

// 创建自定义 hook
const useUserData = createFetchHook(nextSWRFetcher, {
  revalidateOnFocus: true,
  dedupingInterval: 10000
})

// 使用自定义 hook
const { data: userData } = useUserData('/api/user')
```

## 配置选项

所有 hooks 都支持 SWR 的标准配置选项，常用的包括：

| 选项 | 说明 | 默认值 |
|------|------|--------|
| `suspense` | 启用 React Suspense 模式 | `false` |
| `revalidateOnFocus` | 窗口聚焦时重新验证 | `false` |
| `revalidateOnReconnect` | 网络恢复时重新验证 | `true` |
| `refreshInterval` | 定时轮询间隔 (ms) | `0` (禁用) |
| `dedupingInterval` | 去重间隔 (ms) | `5000` |
| `onSuccess` | 请求成功回调 | - |
| `onError` | 请求失败回调 | - |

## 类型支持

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
