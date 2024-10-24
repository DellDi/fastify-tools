import { FastifyPluginAsync } from 'fastify'
import cors from '@fastify/cors'

import { deCryptoBase64, decryptSQLOrigin, enCryptBase64, encryptSQLOrigin, } from '../../utils/crypto.js'
import { cryptoSchema, } from '../../schema/newsee.js'
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const newsee: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  await fastify.register(cors, {
    origin: (origin, cb) => {
      const hostname = new URL(origin || '').hostname
      if (hostname === "localhost") {
        //  Request from localhost will pass
        cb(null, true)
        return
      }
      // Generate an error on other origins, disabling access
      cb(new Error("Not allowed"), false)
    }
  })
  fastify.withTypeProvider<TypeBoxTypeProvider>().post('/handlePassword', {
    schema: cryptoSchema,
    handler: async (request, reply) => {
      request.headers['content-type'] = 'application/json'
      const { content, aesEnOrDeType = 'decrypt' } = request.body
      let result = ''
      switch (aesEnOrDeType) {
        case 'encrypt':
          result = encryptSQLOrigin(content)
          break
        case 'decrypt':
          result = decryptSQLOrigin(content)
          break
        case 'aesEnOrigin':
          result = enCryptBase64(content)
          break
        case 'aesDeOrigin':
          result = deCryptoBase64(content)
          break
      }

      reply.code(200).send({ result, statusCode: 200 })
    },
  })
}

export default newsee
