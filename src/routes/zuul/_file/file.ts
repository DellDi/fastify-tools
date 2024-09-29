import { FastifyPluginAsync } from 'fastify'
import fastifyStatic from '@fastify/static'
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { staticSchema } from "../../../schema/file.js";
import { UPLOAD_DIR } from "../../../utils/index.js";
import fs from "node:fs";

const file: FastifyPluginAsync = async (fastify): Promise<void> => {
    // Serve static files
    fastify.register(fastifyStatic, {
        root: UPLOAD_DIR,
    })
    fastify.withTypeProvider<TypeBoxTypeProvider>().get('', {
        schema: staticSchema,
        handler: async (req, reply) => {
            const pathFileName = req.params.file
            const fileList = fs.readdirSync(UPLOAD_DIR)
            let fileFullName = fileList.find(a => a.includes(pathFileName))
            if (fileFullName !== pathFileName) {
                let realFileName = pathFileName.split('-')[1]
                return reply.code(200).download(pathFileName, realFileName)
            }
            console.log('UPLOAD_DIR', UPLOAD_DIR)
            if (fileFullName) return reply.code(200).sendFile(pathFileName)
            return reply.code(500).send({
                error: "没有对应的文件"
            })
        },
    })
}
export default file
