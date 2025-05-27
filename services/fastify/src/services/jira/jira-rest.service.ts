import { JiraMeta } from '@/schema/jira/meta.js'
import { FastifyInstance } from 'fastify'
import dayjs from 'dayjs'
import { request } from 'undici'
import { fastifyCache } from '@/utils/cache.js'

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
  errors?: Record<string, string>
  id?: string
  key?: string
  self?: string
}

export class JiraRestService {
  jiraUser: string
  jiraPassword: string

  constructor(private fastify: FastifyInstance) {
    const { JIRA_USER = '', JIRA_PASSWORD = '' } = process.env
    this.jiraUser = JIRA_USER
    this.jiraPassword = JIRA_PASSWORD
    this.fastify.log.info(`Jira user: ${JIRA_USER}`)
    this.fastify.log.info(`Jira password: ${JIRA_PASSWORD}`)
  }

  async createIssue(restData: { [key: string]: any }, cookies: string) {
    const issueData: IssueData = {
      fields: {
        project: { key: 'V10' }, // 项目 ID
        summary: restData.title,
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
        description: restData.description || restData.title,
        assignee: restData.assignee ? { name: restData.assignee } : null,
        ...restData.customAutoFields,
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
      (await createTicketResponse.body.json()) as JiraCreateResponse

    // 检查是否有错误信息
    if (createTicketResponse.statusCode >= 400 || responseBody?.errors) {
      const errorMsg = responseBody.errors
        ? Object.entries(responseBody.errors)
            .map(([key, value]) => `${key}: ${value}`)
            .join('\n')
        : `HTTP ${createTicketResponse.statusCode}`
      throw new Error(`创建 Jira 工单失败: ${errorMsg}`)
    }

    return responseBody
  }

  async createMeta(
    projectKey: string,
    issueTypeId: string,
    cookies: string,
    maxResults: number,
    startAt: number
  ) {
    const metaInfo = fastifyCache.get('jira-meta')
    if (metaInfo) {
      return metaInfo
    }
    // 获取创建工单的元数据
    const requestCreateMeta = await request(
      `http://bug.new-see.com:8088/rest/api/2/issue/createmeta/${projectKey}/issuetypes/${issueTypeId}`,
      {
        method: 'GET',
        headers: {
          Cookie: cookies,
          Authorization: 'Basic bmV3c2VlOm5ld3NlZQ==',
          'Content-Type': 'application/json',
          'X-Atlassian-Token': 'no-check', // 禁用 XSRF 检查
        },
        query: {
          maxResults,
          startAt,
        },
      }
    )

    if (requestCreateMeta.statusCode !== 200) {
      throw new Error(`HTTP ${requestCreateMeta.statusCode}`)
    }

    const responseBody = (await requestCreateMeta.body.json()) as {
      maxResults: number
      startAt: number
      total: number
      isLast: boolean
      values: JiraMeta[]
    }

    const result = {
      maxResults,
      startAt,
      total: responseBody.total,
      isLast: responseBody.isLast,
      values: responseBody.values,
    }

    fastifyCache.set('jira-meta', result)

    return result
  }

  getCustomInfo(
    values: JiraMeta[],
    cusstomName: string
  ): {
    [key: string]: any
  } {
    const nameList = ['客户名称', '客户信息']

    const customInfo = values.filter((item) => nameList.includes(item.name))

    const dynamicCustomField: {
      [key: string]: any
    } = {}

    customInfo.forEach((item) => {
      const valueInfo = item.allowedValues.find((obj) =>
        obj.value?.includes(cusstomName)
      )

      if (valueInfo) {
        dynamicCustomField[item.fieldId] = {
          id: valueInfo.id,
        }
      }

      if (valueInfo && valueInfo.children) {
        dynamicCustomField[item.fieldId] = {
          id: valueInfo.id,
          child: {
            id: valueInfo.children[0].id,
          },
        }
      }
    })

    return {
      ...dynamicCustomField,
    }
  }
}
