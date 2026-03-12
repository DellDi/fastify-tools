import fp from 'fastify-plugin'
import { FastifyInstance } from 'fastify'
import { JiraService } from '@/services/jira/jira.service.js'
import { EmailSendService } from '@/services/email/email-send.service.js'
import { LLMService } from '@/services/llm/llm.service.js'

/**
 * Services 插件
 * 将所有业务 Service 注册为 Fastify 装饰器，实现单例模式
 */
export default fp(async (fastify: FastifyInstance) => {
  // 注册 JiraService 单例
  fastify.decorate('jiraService', new JiraService(fastify))

  // 注册 EmailSendService 单例
  fastify.decorate('emailService', new EmailSendService(fastify))

  // 注册 LLMService 单例
  fastify.decorate('llmService', new LLMService(fastify))

  fastify.log.info('Services registered: jiraService, emailService, llmService')
})
