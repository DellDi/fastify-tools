import auth from '@fastify/auth'
import bearerAuth from '@fastify/bearer-auth'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { FastifyReply, FastifyRequest } from 'fastify'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js'
import { z } from 'zod'
import {
  deploySiteZip,
  deploySiteFiles,
  appendDeployLog,
  SLUG_PATTERN,
} from '@/utils/pages.js'

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
  const createServer = (ip: string) => {
    const server = new McpServer({ name: 'dell-pages', version: '1.0.0' })
    server.registerTool(
      'deploy_site',
      {
        title: '部署静态站点',
        description:
          '部署一个静态站点（AI 生成的页面/项目构建产物），' +
          '返回公网可访问的 https://<slug>.pages.delldiagi.top 形式 URL。' +
          '两种站点内容传法二选一：' +
          '① files——{"相对路径": "文本内容"} 映射，纯文本文件直传，' +
          '适合无代码执行环境的客户端（单文件站点传 {"index.html": "..."} 即可）；' +
          '② zipBase64——整站 zip 的 base64，适合有执行环境或含二进制资源的场景。' +
          '不传 slug 则随机生成；传入 slug 会覆盖同名站点。',
        inputSchema: {
          files: z
            .record(z.string(), z.string())
            .optional()
            .describe(
              '方式①：{"相对路径": "文本内容"} 映射，如 {"index.html": "<html>..."}' +
                '；路径可含子目录如 assets/style.css；仅支持文本内容（utf8）'
            ),
          zipBase64: z
            .string()
            .optional()
            .describe('方式②：站点目录打包后的 zip 文件内容，base64 编码'),
          slug: z
            .string()
            .regex(SLUG_PATTERN)
            .optional()
            .describe(
              '可选：子域名 slug（小写字母/数字/连字符），用于固定 URL；同名覆盖'
            ),
        },
      },
      async ({ files, zipBase64, slug }) => {
        if (!files && !zipBase64) {
          throw new Error('必须提供 files 或 zipBase64 之一')
        }
        if (files && zipBase64) {
          throw new Error('files 与 zipBase64 只能二选一')
        }

        let result
        let sizeBytes: number
        if (files) {
          result = await deploySiteFiles(files, sitesDir, slug)
          sizeBytes = Object.values(files).reduce((n, s) => n + s.length, 0)
        } else {
          result = await deploySiteZip(
            Buffer.from(zipBase64!, 'base64'),
            sitesDir,
            slug
          )
          sizeBytes = zipBase64!.length
        }
        await appendDeployLog(sitesDir, {
          action: 'deploy',
          slug: result.slug,
          files: result.files,
          sizeBytes,
          ip,
          via: 'mcp',
        })
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
    const server = createServer(req.ip)
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
