import { FastifyPluginAsync } from 'fastify'

import {
  enCryptBase64,
  deCryptoBase64,
  encryptSQLOrigin,
  decryptSQLOrigin,
} from '../../utils/crypto.js'
import {
  cryptoSchema,
  HandlePasswordBody,
  HandlePasswordResponse,
} from '../../schema/newsee.js'

const newsee: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{
    Body: HandlePasswordBody
    Response: HandlePasswordResponse
  }>('/handlePassword', {
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

      reply.send({ result })
    },
  })
}

export default newsee
