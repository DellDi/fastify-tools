import type { FastifyBaseLogger } from 'fastify'
import { request } from 'undici'
import { JiraUpdateError, ValidationError } from '@/utils/errors.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type {
  JiraLoginCredentials,
  JiraUpdateTicketData,
} from '../types.js'

type JiraConfigLike = {
  endpoints: {
    updateIssue: string
  }
  auth: {
    proxyAuthToken: string
  }
}

export class UpdateTicketUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private sessionService: JiraSessionService,
    private jiraConfig: JiraConfigLike,
  ) {}

  async updateTicket(
    credentials: JiraLoginCredentials,
    data: JiraUpdateTicketData,
  ): Promise<{ message: string }> {
    if (!data.issueIdOrKey || !data.fields) {
      throw new ValidationError('缺少必需字段: issueIdOrKey 和 fields')
    }

    try {
      const session = await this.sessionService.getSession(credentials)

      const updateResponse = await request(
        `${this.jiraConfig.endpoints.updateIssue}/${data.issueIdOrKey}`,
        {
          method: 'PUT',
          headers: {
            Cookie: session.cookies,
            Authorization: this.jiraConfig.auth.proxyAuthToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fields: data.fields,
          }),
        },
      )

      if (updateResponse?.statusCode !== 204) {
        throw new JiraUpdateError(`更新失败: ${updateResponse?.statusCode}`)
      }

      return {
        message: `Jira 工单：${data.issueIdOrKey} 已经更新成功，涉及字段：${Object.keys(
          data.fields,
        ).join(',')}`,
      }
    } catch (error) {
      this.logger.error(`Update ticket error: ${error instanceof Error ? error.message : String(error)}`)
      if (
        error instanceof JiraUpdateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraUpdateError(`更新 Jira 工单失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
