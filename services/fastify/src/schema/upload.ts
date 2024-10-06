import { Type } from '@sinclair/typebox'

// const UploadedFile = Type.Object({
//     file: Type.Object({}),
//     hash: Type.Optional(Type.String()),
// })

const uploadCheck = Type.Array(Type.Object({
  filename: Type.String(),
  fileHash: Type.String()
}))

const headerType = Type.Object({
  'Content-Type': Type.String({
    description: 'multipart/form-data',
    default: 'multipart/form-data',
  }),
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
    200: Type.Array(Type.String({ description: '已存在的文件list' }))
  }
}


export const singleUpload = {
  description: '单文件上传的接口',
  tags: ['upload'],
  consumes: ['multipart/form-data'],
  response: {
    200: Type.Object({
      message: Type.String({ description: '上传成功' }),
      fileUrl: Type.String({ description: '上传文件的URL' }),
      fileHash: Type.String({ description: '上传文件的hash值' }),
    }),
    400: Type.Object({
      error: Type.Any(),
    }),
    413: Type.Object({
      error: Type.Any(),
    })
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
    400: Type.Object({
      error: Type.String(),
    }),
  },
}
