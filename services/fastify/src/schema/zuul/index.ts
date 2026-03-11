import { Type } from '@sinclair/typebox'

const fileQuery = Type.Object({
    file: Type.String({
        description: '需要访问的文件名或哈希后的文件名。',
    })
})

const staticFilenameParams = Type.Object({
    filename: Type.String({
        description: '静态目录中的目标文件名。',
    })
})

// 返回一个静态文件类型的schema
export const staticSchema = {
    tags: ['file'],
    description: '上传文件访问接口。根据文件名或哈希后的文件名获取实际文件内容，适合附件预览或下载场景。',
    params: fileQuery,
    response: {
        200: Type.String({
            description: '文件二进制内容，通常以流或缓冲区形式返回给调用方。'
        }),
        500: Type.Object({
            error: Type.String({
                description: '文件读取失败时返回的错误信息。'
            })
        })
    }
}

export const staticFilenameSchema = {
    description: '静态资源访问接口。根据文件名从基础静态目录中返回文件内容，适合访问固定资源文件。',
    tags: ['file'],
    params: staticFilenameParams,
    response: {
        404: Type.Object({
            error: Type.String({
                description: '指定文件不存在时返回的错误信息。'
            })
        })
    },
}
