import { JiraMeta } from '@/schema/jira/meta.js'
import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
import { request } from 'undici'
import { JiraAddResInfoType } from '@/schema/jira/jira.js'

type IssueData = {
  fields: {
    project: { key: string }
    summary: string
    issuetype: { id: string }
    components: Array<{ id: string }>
    customfield_10000: { id: string }
    customfield_12600: {
      id: string
      child: {
        id: string
      }
    }
    customfield_10041: string
    priority: { id: string }
    description: string
    assignee: { name: string } | null
    [key: string]: any
  }
}

interface JiraCreateResponse {
  id?: string
  key?: string
  self?: string
  errors?: Record<string, string>
  [key: string]: any
}

export class JiraRestService {
  constructor(private fastify: FastifyInstance) {
    const { JIRA_USER = '', JIRA_PASSWORD = '' } = process.env
    this.fastify.log.info(`Jira user: ${JIRA_USER}`)
    this.fastify.log.info(`Jira password: ${JIRA_PASSWORD}`)
  }

  async createIssue(restData: { [key: string]: any }, cookies: string) {
    const issueData: IssueData = {
      fields: {
        project: { key: 'V10' }, // 项目 ID
        summary: restData.summary,
        issuetype: { id: '4' }, // 问题类型 ID
        components: [{ id: '13676' }], // 组件 ID
        customfield_10000: { id: '13163' }, // 使用对象格式提供 ID
        customfield_12600: {
          id: '15862', // This is the ID for the parent option
          child: {
            id: '15863', // This is the ID for the child option
          },
        },
        customfield_10041: dayjs().format('YYYY-MM-DD'),
        priority: { id: '3' },
        description: restData.description || restData.summary,
        assignee: restData.assignee ? { name: restData.assignee } : null,
      },
    }

    // 创建 Jira 工单
    const createTicketResponse = await request(
      'http://bug.new-see.com:8088/rest/api/2/issue',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
          'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
          Cookie: cookies,
        },
        body: JSON.stringify(issueData),
      }
    )

    const responseBody =
      (await createTicketResponse.body.json()) as JiraAddResInfoType

    // 检查是否有错误信息
    if (
      createTicketResponse.statusCode >= 400 ||
      (responseBody as JiraCreateResponse).errors
    ) {
      const errorMsg = (responseBody as JiraCreateResponse).errors
        ? Object.entries((responseBody as JiraCreateResponse).errors!)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        : `HTTP ${createTicketResponse.statusCode}`
      throw new Error(`创建 Jira 工单失败: ${errorMsg}`)
    }

    return responseBody
  }

  createMeta(projectKey: string, issueTypeId: string) {
    return {
      projectKeys: projectKey,
      issuetypeIds: issueTypeId,
      expand: 'projects.issuetypes.fields',
    }
  }

  getCustomInfo(values: JiraMeta[], cusstomName: string) {
    const nameList = ['客户名称', '客户信息']

    const customInfo = values.filter((item) => nameList.includes(item.name))

    const dynamicCustomField: Record<string, string | Record<string, string>> =
      {}

    customInfo.forEach((item) => {
      const valueInfo = item.allowedValues.find((obj) =>
        obj.value?.includes(cusstomName)
      )
      if (valueInfo) {
        dynamicCustomField[item.fieldId] = valueInfo.id
      }

      if (valueInfo?.child) {
        dynamicCustomField[item.fieldId] = {
          id: valueInfo.id,
          child: valueInfo.child.id,
        }
      }
    })
    return {
      ...dynamicCustomField,
    }
  }
}
