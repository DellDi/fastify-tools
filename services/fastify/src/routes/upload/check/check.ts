import fs from 'node:fs'
import { FastifyPluginAsync } from 'fastify'
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import cors from '@fastify/cors'
import { uploadCheckBase } from '../../../schema/upload.js'
import { UPLOAD_DIR } from '../../../utils/index.js'

// 新增秒传验证hash功能
const checkFile: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  // 新增cors
  fastify.register(cors, {
    origin: ['http://localhost:3001', 'http://localhost:3000'],
    methods: ['POST'],
  })


  fastify.withTypeProvider<TypeBoxTypeProvider>().post('', {
      schema: uploadCheckBase,
      async handler(req, reply) {
        const fileInfo = req.body
        const { fileHash } = fileInfo
        // 读取目录中所有的文件名
        const fileNameList = fs.readdirSync(UPLOAD_DIR)
        if (fileNameList.includes(fileHash)) {
          const orgFilename = fileNameList.find((s) => s.includes(fileHash)) as string
          const filename = orgFilename.split('-')[1]
          return reply.code(200).send({
            isExist: true,
            extantFilename: filename,
            fileInfo: {
              fileUrl: `/zuul/${fileHash}`,
              fileHash,
            },
          })
        }
        reply.code(200).send({ isExist: false })
      },
    },
  )
}

export default checkFile
