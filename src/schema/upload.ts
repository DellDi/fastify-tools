import { Type } from '@sinclair/typebox'

const UploadedFile = Type.Object({
    file: Type.Object({}),
    hash: Type.Optional(Type.String()),
})

const headerType = Type.Object({
    'Content-Type': Type.String({
        description: 'multipart/form-data',
        default: 'multipart/form-data',
    }),
})

// 定义文件类型
// const File = Type.Object({
//     name: Type.String(),
//     size: Type.Number(),
//     type: Type.String(),
//     data: Type.Array(Type.Number()) // 使用数字数组来表示二进制数据
// });

// 定义响应类型
// const FileResponse = Type.Object({
//     success: Type.Boolean(),
//     message: Type.Optional(Type.String()),
//     file: Type.Optional(File)
// });

export const uploadBase = {
    description: '文件接口路径验证',
    tags: ['upload'],
    querystring: Type.Object({
        hashId: Type.String(),
    }),
}

export const singleUpload = {
    description: '单文件上传的接口',
    tags: ['upload'],
    consumes: ['multipart/form-data'],
    // formData
    body: UploadedFile,
    response: {
        200: Type.Object({
            message: Type.String({ description: '上传成功' }),
            fileUrl: Type.String({ description: '上传文件的URL' }),
            fileHash: Type.String({ description: '上传文件的hash值' }),
        })
    },
}

export const multipleUpload = {
    description: '大文件分片上传的接口',
    tags: ['upload'],
    headers: headerType,
    consumes: ['multipart/form-data'],
    // body: Type.Object({
    //   file: Type.Array(baseFile),
    // }),
}

export const uploadBatch = {
    description: '批量上传文件',
    tags: ['upload'],
    consumes: ['multipart/form-data'],
    headers: headerType,
    // body: Type.Object({
    //   files: Type.Array(Type.String({ format: 'binary' })),
    // }),
    response: {
        400: Type.Object({
            error: Type.String(),
        }),
    },
}
