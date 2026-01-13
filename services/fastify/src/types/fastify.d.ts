import { MySQLPromiseConnection } from 'fastify-mysql'
import { FastifyInstance, FastifyPluginAsync as OriginalFastifyPluginAsync } from 'fastify'
import { JiraService } from '@/services/jira/jira.service.js'
import { EmailSendService } from '@/services/email/email-send.service.js'

declare module 'fastify' {
  interface FastifyInstance {
    mysql: MySQLPromiseConnection
    mysqlRegistered: boolean
    isConnectedPg: boolean
    config: {
      PORT: string
      NODE_ENV: string
      DATABASE_URL: string
      API_PREFIX?: string
      SMTP_HOST?: string
      SMTP_PORT?: number
      SMTP_USER?: string
      SMTP_PASS?: string
      SMTP_SECURE?: boolean
      JIRA_USERNAME: string
      JIRA_PASSWORD: string
      JIRA_BASE_URL?: string
      JIRA_DEFAULT_PROJECT?: string
      JIRA_DEFAULT_ISSUE_TYPE?: string
      JIRA_DEFAULT_COMPONENT?: string
      JIRA_DEFAULT_PRIORITY?: string
      BEARER_TOKEN: string
      DASHSCOPE_API_KEY?: string
      LLM_BASE_URL?: string
      LLM_MODEL?: string
    }
    // Services 单例
    jiraService: JiraService
    emailService: EmailSendService
  }
}
