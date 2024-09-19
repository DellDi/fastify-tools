import { FastifyPluginAsync } from 'fastify'
import * as cheerio from 'cheerio'

import {
  CustomerInfoResType,
  difyCustomerSchema,
  InputCustomerType,
} from '../../../schema/dify.js'

const customer: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: InputCustomerType
    Response: CustomerInfoResType
  }>('/get-customer', {
    schema: difyCustomerSchema,
    handler: async (request, reply) => {
      const reqBody = request.body
      const { htmlStr, customerName } = reqBody
      const $ = cheerio.load(htmlStr)
      // 客户信息列表
      const optionsList = $('select.cascadingselect-parent').find('option')
      // 客户合同信息列表
      const optionsChild = $('select.cascadingselect-child').find('option')
      const elementName = optionsList
        .toArray()
        .find((e) => customerName && $(e).text().includes(customerName))
      const elementInfo = optionsChild
        .toArray()
        .find((e) => customerName && $(e).text().includes(customerName))

      reply.send({
        customerNameId: $(elementName).attr('value') ?? '',
        customerInfoId: $(elementInfo).attr('value') ?? '',
      })
    },
  })
}

export default customer
