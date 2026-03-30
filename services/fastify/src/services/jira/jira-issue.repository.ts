import { FastifyInstance } from 'fastify'
import { FormData, request } from 'undici'
import { getJiraConfig } from '@/utils/config-helpers.js'
import { dayjs } from './utils.js'
import type {
  IssueData,
  JiraCreateResponse,
  JiraSearchResult,
  JiraTransition,
  JiraUploadAttachmentData,
  JiraUploadAttachmentResponse,
} from './types.js'

export class JiraIssueRepository {
  private jiraConfig: ReturnType<typeof getJiraConfig>

  constructor(private fastify: FastifyInstance) {
    this.jiraConfig = getJiraConfig(fastify)
  }

  private buildCreateIssueData(
    restData: { [key: string]: any },
    projectKey: string,
    issueTypeId: string,
    componentId: string,
    excludedFields: Set<string> = new Set(),
  ): IssueData {
    const fields: IssueData['fields'] = {
      project: { key: projectKey },
      summary: restData.title,
      issuetype: { id: issueTypeId },
      components: [{ id: componentId }],
      customfield_10000: { id: '13163' }, // 客户名称：默认值
      customfield_12600: {
        // 客户名称和选择：关联
        id: '15862',
        child: {
          id: '15863',
        },
      },
      customfield_12000: {
        // 是否已经评审
        id: '13760',
      },
      customfield_10041: dayjs().format('YYYY-MM-DD'), // 期望上线时间
      priority: { id: this.jiraConfig.defaultPriority },
      description: restData.description || restData.title,
      assignee: restData.assignee ? { name: restData.assignee } : null,
      ...restData.customAutoFields,
    }

    for (const fieldKey of excludedFields) {
      delete fields[fieldKey]
    }

    return { fields }
  }

  private async postCreateIssue(issueData: IssueData, cookies: string) {
    const createTicketResponse = await request(
      this.jiraConfig.endpoints.createIssue,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'X-Atlassian-Token': 'no-check',
          Cookie: cookies,
        },
        body: JSON.stringify(issueData),
      },
    )

    const rawBody = await createTicketResponse.body.text()
    let responseBody: JiraCreateResponse = {}

    try {
      responseBody = rawBody ? (JSON.parse(rawBody) as JiraCreateResponse) : {}
    } catch {
      responseBody = {}
    }

    return {
      statusCode: createTicketResponse.statusCode,
      rawBody,
      responseBody,
    }
  }

  private getRetryableCreateIssueFields(responseBody: JiraCreateResponse) {
    const retryableFieldPattern = /cannot be set|appropriate screen|unknown/i
    const protectedFields = new Set(['project', 'summary', 'issuetype'])

    if (!responseBody.errors) {
      return [] as string[]
    }

    return Object.entries(responseBody.errors)
      .filter(([fieldKey, fieldMessage]) => {
        return (
          !protectedFields.has(fieldKey) &&
          retryableFieldPattern.test(String(fieldMessage))
        )
      })
      .map(([fieldKey]) => fieldKey)
  }

  private buildCreateIssueError(
    statusCode: number,
    responseBody: JiraCreateResponse,
    rawBody: string,
    retried: boolean,
  ) {
    const errorMsg = responseBody.errors
      ? Object.entries(responseBody.errors)
          .map(([key, value]) => `${key}: ${value}`)
          .join('\n')
      : `HTTP ${statusCode}${rawBody ? ` - ${rawBody}` : ''}`

    return new Error(
      `创建 Jira 工单失败${retried ? '（重试后仍失败）' : ''}: ${errorMsg}`,
    )
  }

  async addAttachment(
    data: JiraUploadAttachmentData,
    cookies: string,
  ): Promise<JiraUploadAttachmentResponse> {
    const form = new FormData()
    form.append(
      'file',
      new Blob([data.content], {
        type: data.mimeType,
      }),
      data.fileName,
    )

    const response = await request(
      `${this.jiraConfig.endpoints.addAttachment}/${data.issueIdOrKey}/attachments`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'X-Atlassian-Token': 'no-check',
        },
        body: form,
      },
    )

    const rawBody = await response.body.text()
    let parsedBody: unknown = rawBody

    try {
      parsedBody = rawBody ? JSON.parse(rawBody) : null
    } catch {
      parsedBody = rawBody
    }

    if (response.statusCode < 200 || response.statusCode >= 300) {
      this.fastify.log.error(
        {
          issueIdOrKey: data.issueIdOrKey,
          sourceType: data.sourceType,
          fileName: data.fileName,
          mimeType: data.mimeType,
          size: data.size,
          jiraResponse: parsedBody,
        },
        'Jira attachment upload failed',
      )
      throw new Error(
        `上传附件失败: HTTP ${response.statusCode}${rawBody ? ` - ${rawBody}` : ''}`,
      )
    }

    const attachment = Array.isArray(parsedBody) ? parsedBody[0] : parsedBody

    return {
      issueIdOrKey: data.issueIdOrKey,
      sourceType: data.sourceType,
      fileName: data.fileName,
      mimeType: data.mimeType,
      size: data.size,
      attachment: attachment as JiraUploadAttachmentResponse['attachment'],
      message: `Jira 工单 ${data.issueIdOrKey} 附件上传成功`,
    }
  }

  async createIssue(
    restData: { [key: string]: any },
    cookies: string,
    options?: {
      projectKey?: string
      issueTypeId?: string
      componentId?: string
    },
  ) {
    const projectKey =
      options?.projectKey ||
      restData.projectKey ||
      this.jiraConfig.defaultProject
    const issueTypeId =
      options?.issueTypeId ||
      restData.issueTypeId ||
      this.jiraConfig.defaultIssueType
    const componentId = options?.componentId || this.jiraConfig.defaultComponent
    const issueData = this.buildCreateIssueData(
      restData,
      projectKey,
      issueTypeId,
      componentId,
    )

    const firstAttempt = await this.postCreateIssue(issueData, cookies)

    if (firstAttempt.statusCode < 400 && !firstAttempt.responseBody?.errors) {
      return firstAttempt.responseBody
    }

    const retryableFields = this.getRetryableCreateIssueFields(
      firstAttempt.responseBody,
    )

    if (retryableFields.length === 0) {
      throw this.buildCreateIssueError(
        firstAttempt.statusCode,
        firstAttempt.responseBody,
        firstAttempt.rawBody,
        false,
      )
    }

    this.fastify.log.warn(
      {
        projectKey,
        issueTypeId,
        componentId,
        retryableFields,
      },
      'Jira create issue failed with removable fields, retrying once',
    )

    const retryIssueData = this.buildCreateIssueData(
      restData,
      projectKey,
      issueTypeId,
      componentId,
      new Set(retryableFields),
    )

    const retryAttempt = await this.postCreateIssue(retryIssueData, cookies)

    if (retryAttempt.statusCode >= 400 || retryAttempt.responseBody?.errors) {
      throw this.buildCreateIssueError(
        retryAttempt.statusCode,
        retryAttempt.responseBody,
        retryAttempt.rawBody,
        true,
      )
    }

    return retryAttempt.responseBody
  }

  async searchIssuesByJql(
    jql: string,
    cookies: string,
    fields: string[] = ['summary', 'status', 'customfield_10022'],
    maxResults: number = 100,
  ): Promise<JiraSearchResult> {
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/search`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jql,
          fields,
          maxResults,
        }),
      },
    )

    if (response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `JQL 搜索失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }

    return (await response.body.json()) as JiraSearchResult
  }

  async getTransitions(
    issueKey: string,
    cookies: string,
  ): Promise<JiraTransition[]> {
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueKey}/transitions`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
        query: {
          expand: 'transitions.fields',
        },
      },
    )

    if (response.statusCode !== 200) {
      throw new Error(`获取工作流转换失败: HTTP ${response.statusCode}`)
    }

    const data = (await response.body.json()) as {
      transitions: JiraTransition[]
    }
    return data.transitions || []
  }

  async getIssueDetail<T = Record<string, any>>(
    issueIdOrKey: string,
    cookies: string,
    fields?: string[],
  ): Promise<T> {
    let url = `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueIdOrKey}`
    if (fields?.length) {
      url += `?fields=${fields.join(',')}`
    }

    const response = await request(url, {
      method: 'GET',
      headers: {
        Cookie: cookies,
        Authorization: this.jiraConfig.auth.proxyAuthToken,
        'Content-Type': 'application/json',
      },
    })

    if (response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `获取工单详情失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }

    return (await response.body.json()) as T
  }

  async doTransition(
    issueKey: string,
    cookies: string,
    transitionId: string,
    fields?: Record<string, any>,
    comment?: string,
  ): Promise<void> {
    const body: any = {
      transition: { id: transitionId },
    }

    if (fields && Object.keys(fields).length > 0) {
      body.fields = fields
    }

    if (comment) {
      body.update = {
        comment: [
          {
            add: {
              body: comment,
            },
          },
        ],
      }
    }

    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issue/${issueKey}/transitions`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check',
        },
        body: JSON.stringify(body),
      },
    )

    if (response.statusCode !== 204 && response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `执行工作流转换失败: HTTP ${response.statusCode} - ${errorText}`,
      )
    }
  }

  async getIssueLinkTypes(cookies: string): Promise<Array<{ id: string; name: string; inward: string; outward: string }>> {
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issueLinkType`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
        },
      },
    )

    if (response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(`获取链接类型失败: HTTP ${response.statusCode} - ${errorText}`)
    }

    const data = (await response.body.json()) as { issueLinkTypes: Array<{ id: string; name: string; inward: string; outward: string }> }
    return data.issueLinkTypes || []
  }

  async linkIssue(
    inwardIssueKey: string,
    outwardIssueKey: string,
    cookies: string,
    linkTypeName: string = 'Relates',
  ): Promise<void> {
    const response = await request(
      `${this.jiraConfig.baseUrl}/rest/api/2/issueLink`,
      {
        method: 'POST',
        headers: {
          Cookie: cookies,
          Authorization: this.jiraConfig.auth.proxyAuthToken,
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check',
        },
        body: JSON.stringify({
          type: { name: linkTypeName },
          inwardIssue: { key: inwardIssueKey },
          outwardIssue: { key: outwardIssueKey },
        }),
      },
    )

    if (response.statusCode !== 201 && response.statusCode !== 200) {
      const errorText = await response.body.text()
      throw new Error(
        `关联工单失败 (${inwardIssueKey} -> ${outwardIssueKey}): HTTP ${response.statusCode} - ${errorText}`,
      )
    }

    if (response.statusCode !== 201) {
      await response.body.text()
    }
  }
}
