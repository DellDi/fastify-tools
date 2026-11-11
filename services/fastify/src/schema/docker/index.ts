import { Type } from '@fastify/type-provider-typebox'

export const DockerDfSchema = {
  description: 'docker system df：镜像/容器/卷/构建缓存 总量与可回收量（经 docker.sock）。',
  tags: ['docker'],
  response: {
    200: Type.Object({
      images: Type.Object({
        count: Type.Number(),
        size: Type.Number(),
        reclaimable: Type.Number(),
      }),
      containers: Type.Object({
        count: Type.Number(),
        running: Type.Number(),
        size: Type.Number(),
      }),
      volumes: Type.Object({ count: Type.Number(), size: Type.Number() }),
      buildCache: Type.Object({ count: Type.Number(), size: Type.Number() }),
    }),
  },
}

export const DockerImagesSchema = {
  description: '镜像列表（含体积、创建时间、是否被容器引用）。',
  tags: ['docker'],
  response: {
    200: Type.Object({
      images: Type.Array(
        Type.Object({
          id: Type.String(),
          repoTags: Type.Array(Type.String()),
          size: Type.Number(),
          created: Type.Number(),
          containers: Type.Number(),
        })
      ),
    }),
  },
}

export const DockerContainersSchema = {
  description: '容器列表（含已退出）。',
  tags: ['docker'],
  response: {
    200: Type.Object({
      containers: Type.Array(
        Type.Object({
          id: Type.String(),
          name: Type.String(),
          image: Type.String(),
          state: Type.String(),
          status: Type.String(),
          created: Type.Number(),
        })
      ),
    }),
  },
}

export const DockerPruneSchema = {
  description:
    '资源清理。type: dangling=悬空镜像 | images=所有未用镜像 | containers=已停容器 | volumes=未引用卷 | buildcache=构建缓存。',
  tags: ['docker'],
  body: Type.Object({
    type: Type.Union([
      Type.Literal('dangling'),
      Type.Literal('images'),
      Type.Literal('containers'),
      Type.Literal('volumes'),
      Type.Literal('buildcache'),
    ]),
  }),
  response: {
    200: Type.Object({
      reclaimed: Type.Number({ description: '释放字节数。' }),
      detail: Type.Optional(Type.Array(Type.String())),
    }),
  },
}

export const DockerImageDeleteSchema = {
  description: '删除单个镜像（force=true）。被容器引用会 409。',
  tags: ['docker'],
  params: Type.Object({ id: Type.String() }),
  response: { 200: Type.Object({ ok: Type.Boolean() }) },
}

export const DockerLogsSchema = {
  description: '容器日志最后 tail 行（解复用为非 TTY 帧或裸文本）。',
  tags: ['docker'],
  params: Type.Object({ id: Type.String() }),
  querystring: Type.Object({
    tail: Type.Optional(Type.Number({ minimum: 1, maximum: 2000, default: 200 })),
  }),
  response: {
    200: Type.Object({ logs: Type.String() }),
  },
}
