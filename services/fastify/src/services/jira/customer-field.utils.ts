/**
 * 客户相关 Jira 字段工具
 * 从 createmeta 中定位"客户名称/客户信息"字段，并把客户关键字
 * 匹配为 Jira REST API 接受的（可级联）字段值结构。
 */

import { JiraMeta } from '@/schema/jira/meta.js'
import {
  hasMeaningfulCustomerMatch,
  matchCustomerOption,
} from './customer-name.matcher.js'
import type {
  CustomerCandidate,
  CustomerCandidateScore,
} from './types.js'

function toCustomerCandidate(value: {
  id: string
  value?: string
  name?: string
}): CustomerCandidate {
  return {
    id: value.id,
    label: value.value ?? value.name ?? '',
  }
}

function buildJiraCustomerFieldValue(
  bestMatch: CustomerCandidateScore,
  allowedValue: {
    children?: Array<{
      id: string
    }>
  },
): {
  id: string
  child?: {
    id: string
  }
} {
  return {
    id: bestMatch.id,
    ...(allowedValue.children?.[0]?.id
      ? {
          child: {
            id: allowedValue.children[0].id,
          },
        }
      : {}),
  }
}

/**
 * 获取自定义字段信息-动态遍历拼接，客户相关信息
 */
export function getCustomerFieldInfo(
  values: JiraMeta[],
  customerName: string,
): {
  [key: string]: any
} {
  const nameList = ['客户名称', '客户信息']

  const customInfo = values.filter((item) => nameList.includes(item.name))

  const dynamicCustomField: {
    [key: string]: any
  } = {}

  customInfo.forEach((item) => {
    const bestValue = matchCustomerOption(
      customerName,
      item.allowedValues.map((allowedValue) =>
        toCustomerCandidate(allowedValue),
      ),
    )

    if (bestValue?.bestMatch && hasMeaningfulCustomerMatch(bestValue.bestMatch)) {
      const matchedAllowedValue = item.allowedValues[bestValue.bestMatch.originalIndex]

      dynamicCustomField[item.fieldId] = buildJiraCustomerFieldValue(
        bestValue.bestMatch,
        matchedAllowedValue,
      )
    }
  })

  return {
    ...dynamicCustomField,
  }
}
