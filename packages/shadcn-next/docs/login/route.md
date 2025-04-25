### 登录流程

```mermaid
flowchart TD
    A[用户访问页面] --> B{是公开路由?}
    B -->|是| C[直接访问]
    B -->|否| D{中间件检查token}
    D -->|无效| E[重定向到登录页]
    D -->|有效| F{布局组件验证}
    F -->|失败| E
    F -->|成功| G{页面级权限检查}
    G -->|无权限| H[重定向到无权限页面]
    G -->|有权限| I[渲染页面]
    I --> J{侧边栏加载}
    J -->|从localStorage加载| K[立即显示菜单]
    J -->|从Server Action加载| L[获取并显示菜单]
    L --> M[更新localStorage]
```

### 实现细节

#### 菜单数据持久化
- 服务端使用 serviceCache 缓存菜单数据
- 客户端使用 localStorage 存储菜单数据
- 刷新页面时优先从 localStorage 获取，保证用户体验

#### 权限验证层次
- 中间件：基础认证和路由权限控制
- 组件级：动态显示有权限的菜单项
- 页面级：可以使用 Server Actions 进行细粒度权限控制

#### 错误处理
- 添加了完善的错误处理和日志记录
- 优雅降级，即使菜单加载失败也不会影响整体应用

### 数据流程图
```mermaid
sequenceDiagram
    participant User as 用户
    participant Browser as 浏览器
    participant Middleware as 中间件
    participant ServerAction as Server Actions
    participant Cache as 服务端缓存
    participant DB as 数据库
    
    User->>Browser: 访问应用
    Browser->>Middleware: 请求页面
    Middleware->>Cache: 检查用户认证
    
    alt 未认证
        Middleware-->>Browser: 重定向到登录页
        Browser-->>User: 显示登录页
        User->>Browser: 输入凭据
        Browser->>ServerAction: 登录请求
        ServerAction->>DB: 验证凭据
        ServerAction->>DB: 获取用户菜单
        ServerAction->>Cache: 缓存用户信息和菜单
        ServerAction-->>Browser: 返回登录成功
        Browser->>Browser: 存储菜单到localStorage
    else 已认证
        Middleware->>Cache: 获取用户菜单权限
        Middleware->>Middleware: 验证路由权限
        alt 有权限
            Middleware-->>Browser: 允许访问
            Browser->>ServerAction: 获取页面数据
            ServerAction-->>Browser: 返回页面数据
            Browser->>Browser: 从localStorage获取菜单
            Browser-->>User: 渲染页面和菜单
        else 无权限
            Middleware-->>Browser: 返回403错误
            Browser-->>User: 显示无权限页面
        end
    end
```