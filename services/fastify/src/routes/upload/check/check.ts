import fs from 'node:fs'
import { FastifyPluginAsync } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import { uploadCheckBase } from '../../../schema/upload.js'
import { UPLOAD_DIR } from '../../../utils/index.js'

// 新增秒传验证hash功能
const check: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.withTypeProvider<TypeBoxTypeProvider>().post('', {
      schema: uploadCheckBase,
      async handler(req, reply) {
        const fileList = req.body
        const filesToUpload = []
        for (const item of fileList) {
          // 读取目录中所有的文件名
          const fileNameList = fs.readdirSync(UPLOAD_DIR)
          if (fileNameList.includes(item.fileHash)) {
            filesToUpload.push(item.filename)
          }
        }
        return reply.code(200).send(filesToUpload)
      },
    },
  )
}

export default check
