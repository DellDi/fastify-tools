import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyReply, FastifyRequest } from 'fastify'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import { deploySiteZip, SLUG_PATTERN } from '@/utils/pages.js'

const mcp: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  const sitesDir = fastify.config.PAGES_SITES_DIR || '/srv/pages-sites'
  const baseDomain = fastify.config.PAGES_BASE_DOMAIN || 'pages.delldiagi.top'

  fastify
    .register(auth)
    .register(bearerAuth, {
      addHook: true,
      keys: new Set([fastify.config.BEARER_TOKEN]),
    })

  // Streamable HTTP 无状态模式：每个请求独立建 server + transport
  const createServer = () => {
    const server = new McpServer({ name: 'dell-pages', version: '1.0.0' })
    server.registerTool(
      'deploy_site',
      {
        title: '部署静态站点',
        description:
          '把一个静态站点（AI 生成的页面/项目构建产物）打包成 zip 并以 base64 上传部署，' +
          '返回公网可访问的 https://<slug>.pages.delldiagi.top 形式 URL。' +
          '不传 slug 则随机生成；传入 slug 会覆盖同名站点。',
        inputSchema: {
          zipBase64: z
            .string()
            .describe('站点目录打包后的 zip 文件内容，base64 编码'),
          slug: z
            .string()
            .regex(SLUG_PATTERN)
            .optional()
            .describe(
              '可选：子域名 slug（小写字母/数字/连字符），用于固定 URL；同名覆盖'
            ),
        },
      },
      async ({ zipBase64, slug }) => {
        const result = await deploySiteZip(
          Buffer.from(zipBase64, 'base64'),
          sitesDir,
          slug
        )
        return {
          content: [
            {
              type: 'text' as const,
              text: JSON.stringify({
                ...result,
                url: `https://${result.slug}.${baseDomain}`,
              }),
            },
          ],
        }
      }
    )
    return server
  }

  const mcpHandler = async (req: FastifyRequest, reply: FastifyReply) => {
    const server = createServer()
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // 无状态：不签发 mcp-session-id
    })
    reply.raw.on('close', () => {
      void transport.close()
      void server.close()
    })
    await server.connect(transport)
    reply.hijack()
    await transport.handleRequest(req.raw, reply.raw, req.body)
  }

  // url '' 命中 /mcp；find-my-way 默认忽略尾斜杠，/mcp/ 同样可达
  fastify.route({ method: ['POST', 'GET', 'DELETE'], url: '', preHandler: fastify.verifyBearerAuth, handler: mcpHandler })
}

export default mcp
