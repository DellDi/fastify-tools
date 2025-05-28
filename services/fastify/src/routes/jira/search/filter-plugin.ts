import { FastifyPluginAsync } from 'fastify'
import fp from 'fastify-plugin'
import { JiraSearchResponseType } from '../../../schema/jira/jira.js'

/**
 * 自定义字段处理器, 只是为了验证装饰器，本质上没有其他的用处
 * @param fastify Fastify 实例 
 */
const customFieldProcessor: FastifyPluginAsync = async (fastify) => {
  fastify.addHook('onSend', async (request, reply, payload) => {
    try {
      if (reply.getHeader('content-type')?.toString().includes('application/json')) {
        let data = JSON.parse(payload as string) as JiraSearchResponseType

        if (data.issues) {
          data.issues.forEach(issue => {
            const customFieldValue = issue.fields['customfield_10000']?.value
            if (customFieldValue) {
              const [id] = customFieldValue.split('-')
              issue.fields['customFieldCode'] = id as unknown as number
            }
          })
        }
        return JSON.stringify(data)
      }
    } catch (error) {
      fastify.log.error('Error processing custom field:', error)
      return payload
    }
    return payload
  })
}

export default fp(customFieldProcessor, {
  name: 'customFieldProcessor',
})
