import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { Type } from '@fastify/type-provider-typebox'

const link: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  // 查询 Jira 实例支持的所有链接类型
  fastify.get('/types', {
    schema: {
      querystring: Type.Object({
        jiraUser: Type.Optional(Type.String()),
        jiraPassword: Type.Optional(Type.String()),
      }),
      response: {
        200: Type.Array(
          Type.Object({
            id: Type.String(),
            name: Type.String(),
            inward: Type.String(),
            outward: Type.String(),
          }),
        ),
      },
    },
    handler: async (req) => {
      const { jiraUser, jiraPassword } = req.query
      return fastify.jiraService.getIssueLinkTypes({
        jiraUser: jiraUser || fastify.config.JIRA_USERNAME,
        jiraPassword: jiraPassword || fastify.config.JIRA_PASSWORD,
      })
    },
  })

  fastify.post('', {
    schema: {
      body: Type.Object({
        jiraUser: Type.Optional(Type.String({ default: process.env.JIRA_USERNAME })),
        jiraPassword: Type.Optional(Type.String({ default: process.env.JIRA_PASSWORD })),
        sourceIssueKeys: Type.String({
          description: '来源工单 Key，逗号分隔，例如：NDE-4143,NDE-4144',
          examples: ['NDE-4143,NDE-4144'],
        }),
        targetIssueKey: Type.String({
          description: '目标工单 Key，例如：NDE-4145',
          examples: ['NDE-4145'],
        }),
        linkTypeName: Type.Optional(
          Type.String({
            description: '关联类型名称，可通过 GET /jira/link/types 查询可用值',
          }),
        ),
      }),
      response: {
        200: Type.Object({
          results: Type.Array(
            Type.Object({
              issueKey: Type.String(),
              success: Type.Boolean(),
              message: Type.String(),
            }),
          ),
        }),
        400: Type.Object({
          error: Type.String(),
        }),
      },
    },
    handler: async (req, reply) => {
      const { jiraUser, jiraPassword, sourceIssueKeys, targetIssueKey, linkTypeName } = req.body

      const keys = sourceIssueKeys
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)

      if (keys.length === 0) {
        return reply.code(400).send({ error: 'sourceIssueKeys 不能为空' })
      }

      // 若未指定 linkTypeName，自动取第一个可用类型
      let resolvedLinkTypeName = linkTypeName
      if (!resolvedLinkTypeName) {
        const types = await fastify.jiraService.getIssueLinkTypes({
          jiraUser: jiraUser || fastify.config.JIRA_USERNAME,
          jiraPassword: jiraPassword || fastify.config.JIRA_PASSWORD,
        })
        if (types.length === 0) {
          return reply.code(400).send({ error: '无法获取可用的链接类型，请手动指定 linkTypeName' })
        }
        resolvedLinkTypeName = types[0].name
        fastify.log.info(`自动选择链接类型: ${resolvedLinkTypeName}`)
      }

      const result = await fastify.jiraService.linkIssues(
        { jiraUser: jiraUser || '', jiraPassword: jiraPassword || '' },
        keys,
        targetIssueKey,
        resolvedLinkTypeName,
      )

      return result
    },
  })
}

export default link
