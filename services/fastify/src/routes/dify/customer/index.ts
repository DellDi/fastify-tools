import { FastifyPluginAsync } from 'fastify'
import * as cheerio from 'cheerio'

import {
  CustomerInfoResType,
  difyCustomerSchema,
  InputCustomerType,
} from '../../../schema/dify/dify.js'
import { matchCustomerOption } from '../../../services/jira/customer-name.matcher.js'

type MatchedOptionSummary = {
  input: string
  bestLabel?: string
  bestScore: number
  matched: boolean
  rankedCandidates: Array<{
    id: string
    label: string
    score: number
  }>
}

function matchOptionElement(
  customerName: string | undefined,
  options: cheerio.Cheerio<any>,
  $: cheerio.CheerioAPI,
): { element?: any; summary?: MatchedOptionSummary } {
  if (!customerName) {
    return {}
  }

  const elements = options.toArray()
  const result = matchCustomerOption(
    customerName,
    elements.map((element) => ({
      id: $(element).attr('value') ?? '',
      label: $(element).text(),
    })),
  )
  const bestMatch = result.bestMatch
  const matched = Boolean(bestMatch && result.score > 0)
  const element = bestMatch && result.score > 0 ? elements[bestMatch.originalIndex] : undefined

  return {
    element,
    summary: {
      input: customerName,
      bestLabel: bestMatch?.label,
      bestScore: result.score,
      matched,
      rankedCandidates: result.rankedCandidates.slice(0, 3).map((candidate) => ({
        id: candidate.id,
        label: candidate.label,
        score: candidate.score,
      })),
    },
  }
}

const customer: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: InputCustomerType
    Response: CustomerInfoResType
  }>('', {
    schema: difyCustomerSchema,
    handler: async (request, reply) => {
      const reqBody = request.body
      const { htmlStr, htmlStrAll, customerName } = reqBody
      const $1 = cheerio.load(htmlStr)
      const $2 = cheerio.load(htmlStrAll)
      // 客户信息列表
      const optionsList = $1('select').find('option')
      // 客户合同信息列表
      const optionsP = $2('select.cascadingselect-parent').find('option')
      const optionsC = $2('select.cascadingselect-child').find('option')

      const { element: elementName, summary: elementNameSummary } = matchOptionElement(
        customerName,
        optionsList,
        $1,
      )

      const { element: elementInfo, summary: elementInfoSummary } = matchOptionElement(
        customerName,
        optionsP,
        $2,
      )

      const { element: elementInfoAlias, summary: elementInfoAliasSummary } =
        matchOptionElement(customerName, optionsC, $2)

      request.log.info(
        {
          customerName,
          matcher: {
            customerName: elementNameSummary,
            customerInfo: elementInfoSummary,
            customerInfoAlias: elementInfoAliasSummary,
          },
        },
        'dify customer matcher result',
      )

      const customerNum = $2(elementName).text().split('-')[0]
      reply.send({
        isSaaS: +customerNum >= 6000 && +customerNum <= 7000,
        customerNameId: $1(elementName).attr('value') ?? '14169',
        customerInfoId: $2(elementInfo).attr('value') ?? '17714',
        customerInfoIdAlias: $2(elementInfoAlias).attr('value') ?? '21057',
      })
    },
  })
}

export default customer
