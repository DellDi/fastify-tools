import axios from 'axios'
import qs from 'node:querystring'
import { FastifyPluginAsync } from 'fastify'
import { JiraLoginBodyType, jiraLoginSchema } from '../../schema/jira.js'

const jira: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: JiraLoginBodyType }>('/login', {
    schema: jiraLoginSchema,
    handler: async (request, reply) => {
      const jiraUrl =
        'http://newsee:newsee@bug.new-see.com:8088/rest/gadget/1.0/login'
      const { jiraUser, jiraPassword } = request.body

      try {
        const loginResponse = await axios.post(
          jiraUrl,
          qs.stringify({
            os_username: jiraUser,
            os_password: jiraPassword,
            os_cookie: true,
          }),
          {
            headers: {
              'Content-Type':
                'application/x-www-form-urlencoded; charset=UTF-8',
            },
          }
        )
        // 获取授权token
        const setCookieHeader = loginResponse.headers['set-cookie'] ?? []
        const cookies = setCookieHeader
          .map((cookie) => cookie.split(';')[0])
          .join(';')

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
        fastify.log.error(error)
        reply.status(500).send({ error: error })
      }
    },
  })
}

export default jira
