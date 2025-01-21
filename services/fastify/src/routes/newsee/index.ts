import cors from '@fastify/cors'
import { AesContext, strategyMap } from '../../utils/crypto.js'
import { cryptoSchema, sqlSchema } from '../../schema/newsee.js'
import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox'
import { handleSQL } from './handleSQL.js'

const newsee: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.register(cors, {
    origin: (origin, cb) => {
      const hostname = new URL(origin || '').hostname
      const allowedHostnames = ['localhost', '127.0.0.1']
      if (allowedHostnames.includes(hostname)) {
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      // Generate an error on other origins, disabling access
      cb(new Error('origin Not allowed'), false)
    },
  })
  fastify.post('/handlePassword', {
    schema: cryptoSchema,
    handler: async (request, reply) => {
      request.headers['content-type'] = 'application/json'
      const { content, aesEnOrDeType = 'decrypt', isBatch } = request.body
      const strategy = strategyMap[aesEnOrDeType as keyof typeof strategyMap]
      if (!strategy) {
        throw new Error('Unsupported encryption/decryption type');
      }
      const fucAes = new AesContext(strategy)
      // content 支持批量处理，是换行符拼接的字符串
      let result = ''
      if (isBatch) {
        const contentArr = content.split('\n')
        for (let i = 0; i < contentArr.length; i++) {
          const item = contentArr[i]
          // 最后一个不加,
          if (i !== contentArr.length - 1) {
            result += fucAes.executeStrategy(item) + ',' + '\n'
          } else {
            result += fucAes.executeStrategy(item)
          }
        }
      } else {
        result = fucAes.executeStrategy(content)
      }

      reply.code(200).send({ result, statusCode: 200 })
    },
  })

  fastify.post('/handleSQL', {
    schema: sqlSchema,
    handler: async (request, reply) => {
      request.headers['content-type'] = 'application/json'
      const { sql } = request.body
      try {
        const result = await handleSQL(sql, fastify)
        reply.code(200).send({ result, statusCode: 200 })
      } catch (error) {
        reply.code(400).send({ message: JSON.stringify(error), statusCode: 400 })
      }
    },
  })
}

export default newsee
