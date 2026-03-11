import { Type } from '@sinclair/typebox'

export const RootDebugSchema = {
  description: '根路径调试接口。用于快速查看当前请求头是否已正确透传到服务端，适合联调和排查代理问题。',
  tags: ['system'],
  response: {
    200: Type.Object({
      headers: Type.Record(Type.String(), Type.Any(), {
        description: '服务端收到的原始请求头键值映射。',
      }),
    }),
  },
}

export const ClearAllCacheSchema = {
  description: '清空当前服务中的全部缓存。适合本地调试或缓存异常排查，调用后会移除所有缓存项。',
  tags: ['system'],
  response: {
    200: Type.Object({
      success: Type.Boolean({
        description: '缓存是否已成功清空。',
      }),
    }),
  },
}

export const ClearCacheByKeySchema = {
  description: '按缓存键清除指定缓存。适合只刷新某一类缓存，如 Jira Session、元数据缓存等。',
  tags: ['system'],
  params: Type.Object({
    key: Type.String({
      description: '目标缓存键，例如 `jira-session`、`jira-meta`。',
      default: 'jira-session',
    }),
  }),
  response: {
    200: Type.Object({
      success: Type.Boolean({
        description: '指定缓存是否已成功清除。',
      }),
    }),
  },
}
