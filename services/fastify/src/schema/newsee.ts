import { Type } from '@sinclair/typebox'

const passwordBody = Type.Object({
  content: Type.String({
    default: 'r5deoK7XdPmX6iilAchDKA==',
    description: '需要处理的string',
  }),
  aesEnOrDeType: Type.String({
    enum: ['encrypt', 'decrypt', 'aesEnOrigin', 'aesDeOrigin', 'decryptFs', 'encryptFs'],
    default: 'decrypt',
    description:
      '加密处理的类型encrypt（数据库SS） | decrypt(数据库) | aesEnOrigin | aesDeOrigin | 附件加密解密模式decryptFs、encryptFs',
  }),
})

const passwordResponse = Type.Object({
  statusCode: Type.Integer({ default: 200 }),
  result: Type.String(),
})

export const cryptoSchema = {
  tags: ['newsee'],
  description: '处理密码：零和加密、零和解密、AES加密、AES解密',
  consumes: ['application/json'],
  body: passwordBody,
  response: {
    200: passwordResponse,
  },
}

// 输入一段动态安全的sql、输出查询的sql的执行结果
const sqlBody = Type.Object({
  sql: Type.String({
    default: 'select * from user',
    description: '需要执行的sql',
  }),
})

const sqlResponse = Type.Object({
  statusCode: Type.Integer({ default: 200 }),
  result: Type.Array(Type.Any()),
})

export const sqlSchema = {
  tags: ['newsee'],
  description: '执行sql',
  consumes: ['application/json'],
  body: sqlBody,
  response: {
    200: sqlResponse,
    400: Type.Object({
      statusCode: Type.Integer({ default: 400 }),
      message: Type.String(),
    }),
    500: Type.Object({
      statusCode: Type.Integer({ default: 500 }),
      message: Type.String(),
    }),
  },
}
