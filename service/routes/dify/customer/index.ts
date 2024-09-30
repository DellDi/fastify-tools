import { FastifyPluginAsync } from 'fastify'
import * as cheerio from 'cheerio'

import {
  CustomerInfoResType,
  difyCustomerSchema,
  InputCustomerType,
} from '../../../schema/dify/dify.js'

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

      const elementName = optionsList
        .toArray()
        .find((e) => customerName && $1(e).text().includes(customerName))

      const elementInfo = optionsP
        .toArray()
        .find((e) => customerName && $2(e).text().includes(customerName))

      const elementInfoAlias = optionsC
        .toArray()
        .find((e) => customerName && $2(e).text().includes(customerName))

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
