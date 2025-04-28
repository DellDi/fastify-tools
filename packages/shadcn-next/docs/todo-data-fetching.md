# Next.js 数据获取优化待办事项

## 当前问题

在 Next.js App Router 架构中，我们遇到了客户端组件在服务端渲染阶段执行 API 调用的问题：

1. 即使组件标记为 `'use client'`，在首次页面加载时仍会在服务端执行
2. 服务端环境中的 fetch 需要完整 URL（包含协议和域名）
3. 当前的 `fetchBase` 实现没有正确区分服务端和客户端环境

## 建议的长期解决方案：采用 useSWR

### useSWR 优势

1. **自动处理服务端/客户端环境差异**
   - 在 SSR 期间不会触发数据获取
   - 客户端水合后自动获取数据

2. **智能缓存与请求去重**
   - 相同 key 的请求自动合并
   - 多组件共享数据只发起一次请求

   ```typescript
   // 多个组件使用相同的 key，只会发起一次请求
   function ComponentA() {
     const { data } = useSWR('/api/jira/jira-filtered', fetcher)
     return <div>{data?.total}</div>
   }
   
   function ComponentB() {
     const { data } = useSWR('/api/jira/jira-filtered', fetcher)
     return <div>{data?.items?.length}</div>
   }
   ```

3. **自动数据更新策略**
   - 窗口聚焦时自动刷新
   - 网络恢复时自动重新获取
   - 支持定时轮询

   ```typescript
   // 配置自动更新策略
   const { data } = useSWR('/api/jira/jira-filtered', fetcher, {
     refreshInterval: 5000,           // 每5秒轮询一次
     refreshWhenHidden: false,        // 页面不可见时不轮询
     refreshWhenOffline: false,       // 离线时不轮询
     revalidateOnFocus: true,         // 窗口聚焦时重新验证
     revalidateOnReconnect: true,     // 网络恢复时重新验证
     revalidateIfStale: true          // 数据过期时重新验证
   })
   ```

4. **简化的状态管理**
   - 内置 loading/error 状态
   - 乐观更新支持
   - 简洁的 API 设计

   ```typescript
   function JiraIssueList() {
     const { data, error, isLoading, isValidating, mutate } = useSWR('/api/jira/issues', fetcher)
     
     // 加载状态处理
     if (isLoading) return <Skeleton />
     if (error) return <ErrorAlert message={error.message} />
     
     // 乐观更新示例
     const markAsResolved = async (issueId) => {
       // 1. 立即更新本地数据（UI立即响应）
       const optimisticData = {
         ...data,
         items: data.items.map(issue => 
           issue.id === issueId ? { ...issue, status: 'resolved' } : issue
         )
       }
       
       // 2. 发送API请求并重新验证数据
       mutate(optimisticData, {
         revalidate: false // 先不重新验证，等API完成后再验证
       })
       
       // 3. 调用API
       await updateIssueStatus(issueId, 'resolved')
       
       // 4. 重新获取最新数据
       mutate()
     }
     
     return (
       <div>
         {data.items.map(issue => (
           <IssueCard 
             key={issue.id}
             issue={issue}
             onResolve={() => markAsResolved(issue.id)}
           />
         ))}
         {isValidating && <LoadingIndicator />} {/* 后台重新验证时显示加载指示器 */}
       </div>
     )
   }
   ```

5. **高级功能**
   - 分页和无限滚动支持
   - 依赖请求链
   - 预加载数据

   ```typescript
   // 依赖请求链
   function UserIssues() {
     // 先获取用户信息
     const { data: user } = useSWR('/api/user', fetcher)
     
     // 基于用户ID获取该用户的问题列表
     const { data: issues } = useSWR(
       () => user ? `/api/users/${user.id}/issues` : null,
       fetcher
     )
     
     return issues ? <IssueList issues={issues} /> : <Loading />
   }
   
   // 无限滚动
   function InfiniteIssues() {
     const { data, size, setSize, isValidating } = useSWRInfinite(
       (index) => `/api/issues?page=${index + 1}`,
       fetcher
     )
     
     // 合并所有页的数据
     const issues = data ? data.flatMap(page => page.items) : []
     
     return (
       <div>
         <IssueList issues={issues} />
         <button 
           onClick={() => setSize(size + 1)}
           disabled={isValidating}
         >
           {isValidating ? '加载中...' : '加载更多'}
         </button>
       </div>
     )
   }
   ```

### 实现示例

```typescript
// 1. 安装依赖
// pnpm add swr

// 2. 创建全局 fetcher
// utils/swr-fetcher.ts
import { fetchBase } from './fetch/fetch'

export const fetcher = (url: string) => fetchBase(url, {
  headers: { 'Content-Type': 'application/json' }
})

// 3. 组件中使用
import useSWR from 'swr'
import { fetcher } from '@/utils/swr-fetcher'

function JiraPaginator() {
  // 替换 useEffect + fetch
  const { data, error, isLoading } = useSWR('/api/jira/jira-filtered', fetcher)
  
  if (isLoading) return <div>加载中...</div>
  if (error) return <div>加载失败</div>
  
  const totalIssues = data?.total || 0
  
  // 其余组件逻辑...
}
```

### 与传统 useEffect 方式对比

| 特性 | useEffect + fetch | useSWR |
|------|-------------------|--------|
| 请求去重 | ❌ 需手动实现 | ✅ 自动支持 |
| 缓存管理 | ❌ 需手动实现 | ✅ 自动支持 |
| 自动重新获取 | ❌ 需手动实现 | ✅ 自动支持 |
| 错误处理 | ❌ 需手动实现 | ✅ 内置支持 |
| 加载状态 | ❌ 需手动实现 | ✅ 内置支持 |
| 依赖追踪 | ⚠️ 容易出错 | ✅ 自动处理 |
| 并发请求 | ⚠️ 需小心实现 | ✅ 自动处理 |
| 代码行数 | 多 | 少 |
| 可维护性 | 低 | 高 |

## 迁移计划

1. **阶段一：引入 useSWR**
   - 安装 swr 依赖
   - 创建通用 fetcher 函数
   - 为新功能优先采用 useSWR

2. **阶段二：重构现有组件**
   - 识别使用 useEffect + fetch 的组件
   - 优先重构数据依赖复杂的组件
   - 更新测试用例

3. **阶段三：统一数据获取模式**
   - 创建数据获取 hooks 库
   - 实现全局缓存策略
   - 添加错误处理和重试逻辑

## 参考资源

- [SWR 官方文档](https://swr.vercel.app/zh-CN)
- [Next.js 数据获取](https://nextjs.org/docs/app/building-your-application/data-fetching)
- [React Query vs SWR](https://tanstack.com/query/latest/docs/react/comparison)

## 预期收益

- 减少 50% 以上的数据获取相关代码
- 解决服务端渲染环境中的 URL 问题
- 提高应用性能和用户体验
- 简化状态管理和错误处理
