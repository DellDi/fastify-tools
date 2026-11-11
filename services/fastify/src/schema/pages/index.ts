import { Type } from '@sinclair/typebox'

export const pagesDeploy = {
  description:
    '部署静态站点。上传 zip 包解压到 pages 站点目录，返回 https://<slug>.<PAGES_BASE_DOMAIN> 访问地址。可传 slug 字段指定子域名（重复部署会覆盖同名站点），否则随机生成。',
  tags: ['pages'],
  consumes: ['multipart/form-data'],
  response: {
    200: Type.Object({
      slug: Type.String({ description: '站点 slug，即子域名前缀。' }),
      url: Type.String({ description: '站点访问地址。' }),
      files: Type.Number({ description: '解压写入的文件数。' }),
      hasIndexHtml: Type.Boolean({
        description: '根目录是否包含 index.html；为 false 时访问 URL 会 404。',
      }),
    }),
    400: Type.Object({
      error: Type.String({
        description: '部署失败原因，例如未上传文件、zip 无法解析或包含非法路径。',
      }),
    }),
    413: Type.Object({
      error: Type.String({ description: 'zip 或解压后体积超限。' }),
    }),
  },
}

export const pagesList = {
  description: '列出全部已部署站点及最近部署/删除审计日志。',
  tags: ['pages'],
  response: {
    200: Type.Object({
      sites: Type.Array(
        Type.Object({
          slug: Type.String(),
          url: Type.String(),
          files: Type.Number(),
          sizeBytes: Type.Number(),
          mtime: Type.Number({ description: '站点最后更新时间，毫秒时间戳。' }),
          hasIndexHtml: Type.Boolean(),
        })
      ),
      logs: Type.Array(
        Type.Object({
          ts: Type.String(),
          action: Type.String({ description: 'deploy | delete' }),
          slug: Type.String(),
          files: Type.Optional(Type.Number()),
          sizeBytes: Type.Optional(Type.Number()),
          ip: Type.Optional(Type.String()),
          via: Type.Optional(Type.String({ description: 'http | mcp' })),
        })
      ),
    }),
  },
}

export const pagesDelete = {
  description: '按 slug 删除站点目录。',
  tags: ['pages'],
  response: {
    200: Type.Object({
      deleted: Type.Boolean(),
      slug: Type.String(),
    }),
    400: Type.Object({ error: Type.String() }),
    404: Type.Object({ error: Type.String() }),
  },
}
