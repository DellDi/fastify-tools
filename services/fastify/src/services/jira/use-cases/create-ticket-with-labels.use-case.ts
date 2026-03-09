import type { FastifyBaseLogger } from 'fastify'
import type {
  DevReplyResponse,
  JiraCreateTicketData,
  JiraCreateTicketResponse,
  JiraLoginCredentials,
  JiraUpdateTicketData,
} from '../types.js'

type JiraConfigLike = {
  defaultProject: string
}

type CreateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraCreateTicketData,
) => Promise<JiraCreateTicketResponse>

type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

type DevReplyHandler = (
  credentials: Partial<JiraLoginCredentials> | undefined,
  data: {
    issueKey: string
    projectKey: string
    assignee: string
  },
) => Promise<DevReplyResponse>

export class CreateTicketWithLabelsUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private jiraConfig: JiraConfigLike,
    private createTicket: CreateTicketHandler,
    private updateTicket: UpdateTicketHandler,
    private devReply: DevReplyHandler,
  ) {}

  async execute(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData & { labels?: string; autoDevReply?: boolean },
  ): Promise<JiraCreateTicketResponse & { devReply?: DevReplyResponse }> {
    const result = await this.createTicket(credentials, data)

    if (data.labels) {
      const labelArr = data.labels.split(',').filter((label) => label.trim())
      if (labelArr.length > 0) {
        await this.updateTicket(credentials, {
          issueIdOrKey: result.issueKey,
          fields: { labels: labelArr },
        })
      }
    }

    let devReplyResult: DevReplyResponse | undefined
    if (data.autoDevReply) {
      try {
        devReplyResult = await this.devReply(credentials, {
          issueKey: result.issueKey,
          projectKey:
            result.matchInfo?.projectKey ||
            data.projectKey ||
            this.jiraConfig.defaultProject,
          assignee: data.assignee || credentials.jiraUser,
        })
        if (devReplyResult.success) {
          this.logger.info(`Dev reply completed for ${result.issueKey}`)
        } else {
          this.logger.warn(`Dev reply failed for ${result.issueKey}: ${devReplyResult.message}`)
        }
      } catch (devReplyError) {
        this.logger.warn(
          `Dev reply failed for ${result.issueKey}: ${devReplyError instanceof Error ? devReplyError.message : String(devReplyError)}`,
        )
        devReplyResult = {
          success: false,
          issueKey: result.issueKey,
          message: `开发回复失败: ${devReplyError instanceof Error ? devReplyError.message : String(devReplyError)}`,
        }
      }
    }

    return {
      ...result,
      devReply: devReplyResult,
    }
  }
}
