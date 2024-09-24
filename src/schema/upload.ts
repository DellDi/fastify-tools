import { Type } from '@sinclair/typebox'

const baseFile = Type.Object({
  filename: Type.String(),
  data: Type.String(),
})

const UploadedFile = Type.Object({
  originalName: Type.String(),
  fileUrl: Type.String(),
})

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
  // response: {
  //   200: Type.Object({
  //     msg: Type.String(),
  //   }),
  // },
}

export const singleUpload = {
  description: '单文件上传的接口',
  tags: ['upload'],
  consumes: ['multipart/form-data'],
  // body: Type.Object({
  //   file: baseFile,
  // }),
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
    200: Type.Object({
      message: Type.String(),
      uploadedFiles: Type.Array(UploadedFile),
    }),
    400: Type.Object({
      error: Type.String(),
    }),
  },
}
