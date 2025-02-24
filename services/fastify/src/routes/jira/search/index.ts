import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { request } from 'undici'
import { JiraSearchResponseType, JiraSearchSchema } from '../../../schema/jira/jira.js'
import cors from '@fastify/cors'
import customFieldProcessor from './filter-plugin.js'

const jira: FastifyPluginAsyncTypebox = async (fastify, opts): Promise<void> => {
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  fastify.register(customFieldProcessor)

  fastify.post('', {
    schema: JiraSearchSchema,
    handler: async (req, reply) => {
      try {
        const { jql, jiraCookies, startAt, maxResults } = req.body
        // search Jira tickets
        const jiraRes = await request(
          `http://bug.new-see.com:8088/rest/api/2/search`,
          {
            method: 'GET',
            query: {
              startAt,
              maxResults,
              jql,
            },
            headers: {
              Cookie: jiraCookies,
              Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
            },
          },
        )

        if (jiraRes?.statusCode !== 200) {
          reply.code(500).send({ error: jql })
        }
        const jiraData = await jiraRes.body.json() as JiraSearchResponseType
        reply.code(200).send(jiraData)
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
