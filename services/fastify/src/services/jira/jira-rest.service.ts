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

  /**
   * 获取自定义字段信息-动态遍历拼接，客户相关信息
   */
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

  private async callLLM(
    messages: Array<{ role: string; content: string }>
  ): Promise<string> {
    try {
      const response = await fetch(
        'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.DASHSCOPE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'qwen3-flash',
            messages,
            temperature: 0.3, // 降低随机性，提高确定性
            top_p: 0.5, // 限制候选词范围，提高一致性
            response_format: { type: 'json_object' },
          }),
        }
      )

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`LLM API error: ${response.status} - ${error}`)
      }

      const data = (await response.json()) as {
        choices: Array<{ message: { content: string } }>
      }
      this.fastify.log.info(
        data.choices[0],
        'data.choices[0]?.message?.content?.trim()'
      )

      return data.choices[0]?.message?.content?.trim() || '{}'
    } catch (error: any) {
      this.fastify.log.error('LLM API call failed:', error)
      throw new Error(`调用LLM接口失败: ${error?.message || String(error)}`)
    }
  }

  async genCustomInfo(
    values: JiraMeta[],
    summary: string,
    description: string
  ): Promise<Record<string, string>> {
    // 1. 筛选出必填的自定义字段 - 当前只处理字符串类型
    const requiredCustomFields = values.filter((field) => {
      const isCustomField = field.fieldId?.startsWith('customfield')
      const isRequired = field.required
      const isStringType = field.schema?.type === 'string'
      return isCustomField && isRequired && isStringType && field.name
    })

    if (requiredCustomFields.length === 0) {
      return {}
    }

    // 如果没有提供 API Key，直接返回字段名作为值
    if (!process.env.DASHSCOPE_API_KEY) {
      this.fastify.log.warn(
        'DASHSCOPE_API_KEY not provided, using field names as values'
      )
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, field.name])
      )
    }

    try {
      // 2. 构建提示词
      const fieldsInfo = requiredCustomFields.map((field) => ({
        fieldId: field.fieldId,
        name: field.name,
        description:
          'schema' in field &&
          field.schema &&
          typeof field.schema === 'object' &&
          'custom' in field.schema
            ? `字段类型：${field.schema.type}，控件类型:${field.schema.custom}`
            : '无描述信息',
      }))

      const systemPrompt = `你是一个专业的JIRA问题助手，负责根据问题描述为必填字段生成合适的值。

## 任务说明：
- 请根据提供的"问题标题"和"问题描述"，为每个必填字段生成合适的值
- 请确保生成的值符合字段的描述要求
- 如果无法确定合适的值，也要返回一个值。一定要是明确的，不能出现可能相关字眼
- 必须返回有效的JSON对象，键是字段ID，值是字符串
- 不要包含任何解释性文字，只返回JSON对象

## 必填字段信息：
${JSON.stringify(fieldsInfo, null, 2)}`


      const userPrompt = `## 问题标题：
${summary}

## 问题描述：
${description}

请为上述必填字段生成合适的值，直接返回JSON对象，格式如下：
{
  "customfield_xxxxx": "值1",
  "customfield_yyyyy": "值2"
}`

      // 3. 调用LLM
      const response = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ])

      // 4. 解析响应
      let result: Record<string, string> = {}
      try {
        const parsed = JSON.parse(response)
        // 验证响应格式
        if (typeof parsed === 'object' && parsed !== null) {
          result = Object.fromEntries(
            Object.entries(parsed).filter(
              ([key, value]) =>
                typeof key === 'string' &&
                key.startsWith('customfield') &&
                typeof value === 'string'
            )
          ) as Record<string, string>
        }
      } catch (parseError) {
        this.fastify.log.error('Failed to parse LLM response:', parseError)
        throw new Error('解析LLM响应失败，返回的不是有效的JSON格式')
      }

      // 5. 确保所有必填字段都有值
      for (const field of requiredCustomFields) {
        if (!(field.fieldId in result)) {
          result[field.fieldId] = ''
        }
      }

      return result
    } catch (error) {
      this.fastify.log.error('Error in genCustomInfo:', error)
      // 出错时返回包含所有必填字段的空对象
      return Object.fromEntries(
        requiredCustomFields.map((field) => [field.fieldId, ''])
      )
    }
  }
}
