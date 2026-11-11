import { Type } from '@sinclair/typebox'
export * from './llm.js'

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

const SystemStatusObject = Type.Object({
  ts: Type.Number({ description: '采样时间戳（毫秒）。' }),
  uptimeSec: Type.Number({ description: '宿主机运行时长（秒）。' }),
  cpu: Type.Object({
    cores: Type.Number({ description: 'CPU 核数。' }),
    usagePercent: Type.Number({ description: 'CPU 使用率 %（/proc/stat 双采样）。' }),
    load1: Type.Number({ description: '1 分钟负载均值。' }),
    load5: Type.Number({ description: '5 分钟负载均值。' }),
    load15: Type.Number({ description: '15 分钟负载均值。' }),
    runningProcs: Type.Union([Type.Number(), Type.Null()], {
      description: '运行中进程数（/proc/loadavg）。',
    }),
    totalProcs: Type.Union([Type.Number(), Type.Null()], {
      description: '进程总数（/proc/loadavg）。',
    }),
    perCore: Type.Union([Type.Array(Type.Number()), Type.Null()], {
      description: '每核 CPU 使用率 % 数组。',
    }),
  }),
  memory: Type.Object({
    totalBytes: Type.Number({ description: '内存总量（字节）。' }),
    usedBytes: Type.Number({ description: '已用内存（字节，扣除 MemAvailable）。' }),
    usagePercent: Type.Number({ description: '内存使用率 %。' }),
    cachedBytes: Type.Union([Type.Number(), Type.Null()], { description: '页缓存（字节）。' }),
    buffersBytes: Type.Union([Type.Number(), Type.Null()], { description: '缓冲区（字节）。' }),
    swapTotalBytes: Type.Union([Type.Number(), Type.Null()], { description: 'Swap 总量（字节）。' }),
    swapUsedBytes: Type.Union([Type.Number(), Type.Null()], { description: 'Swap 已用（字节）。' }),
  }),
  disk: Type.Union(
    [
      Type.Object({
        path: Type.String({ description: '采样的挂载路径。' }),
        totalBytes: Type.Number({ description: '磁盘总量（字节）。' }),
        usedBytes: Type.Number({ description: '已用空间（字节）。' }),
        usagePercent: Type.Number({ description: '磁盘使用率 %。' }),
        readBytesPerSec: Type.Union([Type.Number(), Type.Null()], {
          description: '所在块设备读速率（字节/秒）。',
        }),
        writeBytesPerSec: Type.Union([Type.Number(), Type.Null()], {
          description: '所在块设备写速率（字节/秒）。',
        }),
      }),
      Type.Null(),
    ],
    { description: '宿主机磁盘占用；采样失败时为 null。' }
  ),
  process: Type.Object({
    uptimeSec: Type.Number({ description: 'fastify 进程运行时长（秒）。' }),
    rssBytes: Type.Number({ description: 'fastify 进程常驻内存（字节）。' }),
    eventLoopDelayMs: Type.Union([Type.Number(), Type.Null()], {
      description: '事件循环延迟均值（毫秒，区间采样）。',
    }),
  }),
  network: Type.Union(
    [
      Type.Object({
        rxBytesPerSec: Type.Union([Type.Number(), Type.Null()], {
          description: '接收速率（字节/秒）。',
        }),
        txBytesPerSec: Type.Union([Type.Number(), Type.Null()], {
          description: '发送速率（字节/秒）。',
        }),
        hostView: Type.Boolean({
          description: 'true=宿主机全机流量（/host/proc），false=容器自身网卡。',
        }),
      }),
      Type.Null(),
    ],
    { description: '网络收发速率；netdev 不可读时为 null。' }
  ),
  containers: Type.Array(
    Type.Object({
      name: Type.String({ description: '容器名。' }),
      image: Type.String({ description: '镜像名。' }),
      state: Type.String({ description: 'running/exited 等状态。' }),
      status: Type.String({ description: 'docker 状态文本（Up xx 等）。' }),
    }),
    { description: 'Docker 容器列表；未挂载 docker.sock 时为空数组。' }
  ),
  databases: Type.Array(
    Type.Object({
      name: Type.String({ description: '库名。' }),
      sizeBytes: Type.Number({ description: '实际体积（字节）。' }),
    }),
    { description: 'fastify_db / shadcn_next 实际体积；查询失败时为空数组。' }
  ),
  pages: Type.Union(
    [
      Type.Object({
        sites: Type.Number({ description: '已部署站点数。' }),
        totalBytes: Type.Number({ description: '站点总占用（字节）。' }),
      }),
      Type.Null(),
    ],
    { description: 'Pages 站点统计；目录不可读时为 null。' }
  ),
  certificates: Type.Array(
    Type.Object({
      domain: Type.String({ description: '证书域名（含 *.pages 泛域名）。' }),
      daysLeft: Type.Union([Type.Number(), Type.Null()], {
        description: '证书剩余天数；探测失败为 null。',
      }),
    }),
    { description: 'TLS 证书有效期探测结果。' }
  ),
})

export const SystemStatusSchema = {
  description:
    '服务器实时状态（最近一次采样快照）。容器内 /proc 与站点挂载点读取的是宿主机数据：CPU（总量+每核）/内存构成/磁盘容量与 IO/网络收发/运行时长/进程数，外加业务库体积、Pages 站点统计、Docker 容器列表、TLS 证书有效期。',
  tags: ['system'],
  response: {
    200: SystemStatusObject,
  },
}

export const SystemHistorySchema = {
  description: '服务器状态历史采样序列（内存环形缓冲，30s 一个点，最长约 24h，进程重启清空）。',
  tags: ['system'],
  querystring: Type.Object({
    hours: Type.Optional(
      Type.Number({ description: '回溯小时数，默认 24。', default: 24, minimum: 1, maximum: 72 })
    ),
  }),
  response: {
    200: Type.Object({
      samples: Type.Array(SystemStatusObject),
    }),
  },
}
