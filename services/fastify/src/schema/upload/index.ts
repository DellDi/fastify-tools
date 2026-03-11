import { Type } from '@sinclair/typebox'

const uploadCheck = Type.Object({
  filename: Type.String({
    description: '原始文件名。主要用于回显或与服务端已有文件做辅助比对。',
  }),
  fileHash: Type.String({
    description: '文件内容哈希值。服务端基于该值判断文件是否已存在，以支持秒传。',
  }),
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
  description: '按文件哈希下载或定位已上传文件。适合通过 hashId 查询文件是否存在并直接触发下载。',
  tags: ['upload'],
  querystring: Type.Object({
    hashId: Type.String({
      description: '文件哈希标识。通常传入文件内容对应的 hash，用于定位已上传文件。',
    }),
  }),
}

export const uploadCheckBase = {
  description: '文件秒传校验接口。根据文件哈希检查服务端是否已存在相同文件，适合上传前做去重判断。',
  tags: ['upload'],
  body: uploadCheck,
  response: {
    200: Type.Object({
      isExist: Type.Boolean({
        description: '文件是否已存在于服务端。',
      }),
      extantFilename: Type.Optional(Type.String({
        description: '已存在文件的原始文件名，仅在 `isExist=true` 时返回。',
      })),
      fileInfo: Type.Optional(Type.Any({
        description: '已存在文件的访问信息，仅在 `isExist=true` 时返回，包含访问地址与文件哈希。',
      })),
    }),
  },
}

export const singleUpload = {
  description: '单文件上传接口。支持基础文件类型校验、大小限制和同哈希文件秒传返回。',
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
      error: Type.Any({
        description: '上传失败原因，例如未上传文件或文件类型不被允许。',
      }),
    }),
    413: Type.Object({
      error: Type.Any({
        description: '文件体积超出服务端限制时返回的错误信息。',
      }),
    }),
  },
}

export const chunkUpload = {
  description: '大文件分片上传接口。适合前端按 chunk 逐片上传大文件，再由服务端合并处理。',
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
  description: '批量上传接口。支持一次上传多个文件，返回每个文件的访问地址，适合批量附件上传场景。',
  tags: ['upload'],
  consumes: ['multipart/form-data'],
  headers: headerType,
  response: {
    200: Type.Object({
      message: Type.String({ description: '批量上传成功' }),
      uploadedFiles: Type.Array(Type.Object({
        originalName: Type.String({
          description: '上传前的原始文件名。',
        }),
        fileUrl: Type.String({
          description: '上传成功后的文件访问地址。',
        }),
      })),
    }),
    400: Type.Object({
      error: Type.String({
        description: '批量上传失败原因，例如文件数量超限或请求格式错误。',
      }),
    }),
  },
}
