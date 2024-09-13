import { Type } from '@sinclair/typebox';
const passwordBody = Type.Object({
    content: Type.String({
        default: 'r5deoK7XdPmX6iilAchDKA==',
        description: '需要处理的string',
    }),
    aesEnOrDeType: Type.String({
        enum: ['encrypt', 'decrypt', 'aesEnOrigin', 'aesDeOrigin'],
        default: 'decrypt',
        description: '加密处理的类型encrypt（数据库SS） | decrypt(数据库) | aesEnOrigin | aesDeOrigin',
    }),
});
const passwordResponse = Type.Object({
    result: Type.String(),
});
export const cryptoSchema = {
    tags: ['newsee'],
    description: '处理密码：零和加密、零和解密、AES加密、AES解密',
    consumes: ['application/json'],
    body: passwordBody,
    response: {
        200: passwordResponse,
    },
};
