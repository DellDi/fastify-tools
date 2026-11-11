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
