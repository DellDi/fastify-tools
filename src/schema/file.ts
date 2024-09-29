import { Type } from '@sinclair/typebox'

const fileQuery = Type.Object({
    file: Type.String({
        description: '文件名称'
    })
})

// 返回一个静态文件类型的schema
export const staticSchema = {
    tags: ['file'],
    description: '静态文件访问',
    params: fileQuery,
    response: {
        200: Type.String({
            description: 'The binary content of the file, typically transmitted as a stream or buffer'
        }),
        500: Type.Object({
            error: Type.String()
        })
    }
}
