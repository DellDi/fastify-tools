import { Type } from '@sinclair/typebox'

const uploadCheck = Type.Object({
  filename: Type.String(),
  fileHash: Type.String(),
})

const headerType = Type.Object({
  'Content-Type': Type.String({
    description: 'multipart/form-data',
    default: 'multipart/form-data',
  }),
})

const resFileType = Type.Object({
  fileUrl: Type.String({ description: '上传文件的URL' }),
  fileHash: Type.String({ description: '上传文件的hash值' }),
})

export const uploadBase = {
  description: '文件接口路径验证',
  tags: ['upload'],
  querystring: Type.Object({
    hashId: Type.String(),
  }),
}

export const uploadCheckBase = {
  description: '文件接口路径验证',
  tags: ['upload'],
  body: uploadCheck,
  response: {
    200: Type.Object({
      isExist: Type.Boolean(),
      extantFilename: Type.Optional(Type.String()),
      fileInfo: Type.Optional(resFileType),
    }),
  },
}

export const singleUpload = {
  description: '单文件上传的接口',
  tags: ['upload'],
  consumes: ['multipart/form-data'],
  response: {
    // 200 返回合并 resFileType 类型 和 message 字段
    200: Type.Composite([
      resFileType,
      Type.Object({
        message: Type.String({ description: '文件上传成功' }),
      })
    ]),
    400: Type.Object({
      error: Type.Any(),
    }),
    413: Type.Object({
      error: Type.Any(),
    }),
  },
}

export const chunkUpload = {
  description: '大文件分片上传的接口',
  tags: ['upload'],
  headers: headerType,
  consumes: ['multipart/form-data'],
  // body: Type.Object({
  //   chunkIndex: Type.Number(),
  //   totalChunks: Type.Number(),
  //   fileHash: Type.String(),
  // }),
}

export const uploadBatch = {
  description: '批量上传文件',
  tags: ['upload'],
  consumes: ['multipart/form-data'],
  headers: headerType,
  response: {
    200: Type.Object({
      message: Type.String({ description: '批量上传成功' }),
      uploadedFiles: Type.Array(Type.Object({
        originalName: Type.String(),
        fileUrl: Type.String(),
      })),
    }),
    400: Type.Object({
      error: Type.String(),
    }),
  },
}
