import type { FastifyBaseLogger } from 'fastify'
import { JiraCreateError, ValidationError } from '@/utils/errors.js'
import type { JiraRestService } from '../jira-rest.service.js'
import type { JiraSessionService } from '../jira-session.service.js'
import type {
  JiraCreateTicketData,
  JiraCreateTicketResponse,
  JiraLoginCredentials,
  JiraUpdateTicketData,
} from '../types.js'

type JiraConfigLike = {
  baseUrl: string
  defaultProject: string
  defaultIssueType: string
}

type UpdateTicketHandler = (
  credentials: JiraLoginCredentials,
  data: JiraUpdateTicketData,
) => Promise<{ message: string }>

export class CreateTicketUseCase {
  constructor(
    private logger: FastifyBaseLogger,
    private jiraRestService: JiraRestService,
    private sessionService: JiraSessionService,
    private jiraConfig: JiraConfigLike,
    private updateTicket: UpdateTicketHandler,
  ) {}

  async createTicket(
    credentials: JiraLoginCredentials,
    data: JiraCreateTicketData,
  ): Promise<JiraCreateTicketResponse> {
    if (!data.title || !data.description) {
      throw new ValidationError('缺少必需字段: title 和 description')
    }

    try {
      const session = await this.sessionService.getSession(credentials)

      let projectKey = data.projectKey || this.jiraConfig.defaultProject
      let issueTypeId = data.issueTypeId || this.jiraConfig.defaultIssueType
      let matchInfo: JiraCreateTicketResponse['matchInfo'] | undefined

      if (data.smartMatch && (!data.projectKey || !data.issueTypeId)) {
        try {
          const projects = await this.jiraRestService.getProjects(session.cookies)
          const { issueTypes } = await this.jiraRestService.getIssueTypes(
            projectKey,
            session.cookies,
          )

          const match = await this.jiraRestService.matchProjectAndIssueType(
            data.matchPrompt || '',
            data.title,
            data.description,
            projects,
            issueTypes,
          )

          projectKey = match.projectKey
          issueTypeId = match.issueTypeId
          matchInfo = match

          this.logger.info(
            `Smart match result: componentId=${match.componentId}, project=${projectKey}, issueType=${issueTypeId}, confidence=${match.confidence}`,
          )
        } catch (matchError) {
          this.logger.warn(
            `Smart match failed, using defaults: ${matchError instanceof Error ? matchError.message : String(matchError)}`,
          )
        }
      }

      const metaResponse = await this.jiraRestService.createMeta(
        projectKey,
        issueTypeId,
        session.cookies,
        25,
        0,
      )

      const genCustomInfo = await this.jiraRestService.genCustomInfo(
        metaResponse.values,
        data.title,
        data.description,
      )

      this.logger.info(genCustomInfo, 'genCustomInfo')

      const createResponse = await this.jiraRestService.createIssue(
        {
          title: data.title,
          description: data.description,
          assignee: data.assignee,
          customAutoFields: {
            ...genCustomInfo,
            ...data.customAutoFields,
          },
        },
        session.cookies,
        { projectKey, issueTypeId, componentId: matchInfo?.componentId },
      )

      if (!createResponse.id || !createResponse.key) {
        throw new JiraCreateError('创建 Jira 工单返回数据缺少必要字段')
      }

      if (data.customerName) {
        const customInfo = this.jiraRestService.getCustomInfo(
          metaResponse.values,
          data.customerName,
        )

        if (Object.keys(customInfo).length > 0) {
          await this.updateTicket(credentials, {
            issueIdOrKey: createResponse.key,
            fields: customInfo,
          })
        }
      }

      return {
        issueId: createResponse.id,
        issueKey: createResponse.key,
        issueUrl: `${this.jiraConfig.baseUrl}/browse/${createResponse.key}`,
        updateMsg: '工单创建成功',
        matchInfo,
      }
    } catch (error) {
      this.logger.error(`Create ticket error: ${error instanceof Error ? error.message : String(error)}`)
      if (
        error instanceof JiraCreateError ||
        error instanceof ValidationError
      ) {
        throw error
      }
      throw new JiraCreateError(`创建 Jira 工单失败: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}
