import { JiraMeta } from '../../schema/jira/meta.js'
import { FastifyInstance } from 'fastify'

export class JiraRestService {
  constructor(private fastify: FastifyInstance) {
    const { JIRA_USER = '', JIRA_PASSWORD = '' } = process.env
    this.fastify.log.info(`Jira user: ${JIRA_USER}`)
    this.fastify.log.info(`Jira password: ${JIRA_PASSWORD}`)
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

    const dynamicCustomField: Record<string, string | Record<string, string>> = {}

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
