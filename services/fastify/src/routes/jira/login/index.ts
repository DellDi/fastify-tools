import { request } from 'undici'
import { FastifyPluginAsync } from 'fastify'
import {
  JiraLoginBodyType,
  JiraLoginResponseType,
  jiraLoginSchema,
} from '../../../schema/jira/jira.js'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: JiraLoginBodyType; Response: JiraLoginResponseType }>(
    '',
    {
      schema: jiraLoginSchema,
      handler: async (req, reply) => {
        const jiraUrl = 'http://bug.new-see.com:8088/rest/auth/1/session'

        const { jiraUser, jiraPassword } = req.body

        try {
          const loginResponse = await request(
            jiraUrl,
            {
              method: 'POST',
              headers: {
                Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                username: jiraUser,
                password: jiraPassword,
              }),
            }
          )

          if (loginResponse.statusCode !== 200) {
            return reply.code(400).send({ error: 'Login failed' })
          }
          // 获取授权cookies
          const setCookieHeader = loginResponse.headers['set-cookie'] ?? []

          const cookies = Array.isArray(setCookieHeader)
            ? setCookieHeader
                .map((cookie: string) => cookie.split(';')[0])
                .join(';')
            : setCookieHeader.split(';')[0]

          let atlToken = ''
          if (Array.isArray(setCookieHeader)) {
            const xsrfCookie = setCookieHeader.find((cookie) =>
              cookie.startsWith('atlassian.xsrf.token=')
            )
            if (xsrfCookie) {
              atlToken = xsrfCookie.split(';')[0].split('=')[1]
            }
          }
          return { cookies, atlToken }
        } catch (error) {
          fastify.log.error('error---->', error)
          reply.status(500).send({ error: error })
        }
      },
    }
  )
}

export default jira
