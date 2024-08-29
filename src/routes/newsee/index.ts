import { FastifyPluginAsync } from 'fastify'
import {
  enCryptBase64,
  deCryptoBase64,
  encryptSQLOrigin,
  decryptSQLOrigin,
} from '../../utils/crypto.js'

// 类型
type aesEnOrDeType = 'encrypt' | 'decrypt' | 'aesEnOrigin' | 'aesDeOrigin'

const newsee: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post('/handlePassword', {
    schema: {
      body: {
        content: { type: 'string', description: '需要处理的string' },
        aesEnOrDeType: {
          type: 'string',
          description:
            '加密处理的类型encrypt | decrypt | aesEnOrigin | aesDeOrigin',
          enum: ['encrypt', 'decrypt', 'aesEnOrigin', 'aesDeOrigin'],
          default: 'decrypt',
        },
      },
    },
    handler: async (request, reply) => {
      request.headers['content-type'] = 'application/json'

      const { content, aesEnOrDeType = 'decrypt' } = request.body as {
        content: string
        aesEnOrDeType: aesEnOrDeType
      }

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
