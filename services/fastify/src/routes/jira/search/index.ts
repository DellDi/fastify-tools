import { FastifyPluginAsync } from 'fastify'
import { request } from 'undici'
import { JiraSearchResponseType, JiraSearchSchema, } from '../../../schema/jira/jira.js'
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cors from "@fastify/cors";


const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.register(cors, {
    origin: '*',
    methods: ['GET', 'POST'],
  })

  fastify.withTypeProvider<TypeBoxTypeProvider>().post('', {
    schema: JiraSearchSchema,
    handler: async (req, reply) => {
      try {
        const { jql, jiraCookies } = req.body
        // search Jira tickets
        const jiraRes = await request(
            `http://bug.new-see.com:8088/rest/api/2/search`,
            {
              method: 'GET',
              query: {
                jql
              },
              headers: {
                Cookie: jiraCookies,
                Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
              },
            }
        )

        if (jiraRes?.statusCode !== 200) {
          return reply.code(500).send({ error: jql })
        }
        const jiraData = await jiraRes.body.json() as JiraSearchResponseType
        return reply.code(200).send(jiraData)
      } catch (error) {
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
