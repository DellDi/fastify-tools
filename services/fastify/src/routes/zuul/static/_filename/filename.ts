import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import fastifyStatic from '@fastify/static'
import fs from "node:fs";
import { staticFilenameSchema } from '@/schema/zuul/index.js'
import { BASE_STATIC_URL } from "../../../../utils/index.js";

const filename: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
    // Serve static files
    fastify.register(fastifyStatic, {
        root: BASE_STATIC_URL,
    })

    fastify.get('', {
        schema: staticFilenameSchema,
        handler: async (req, reply) => {
            const pathFileName = req.params.filename
            const fileList = fs.readdirSync(BASE_STATIC_URL)
            let fileFullName = fileList.find(a => a.includes(pathFileName))
            console.log('BASE_STATIC_URL', BASE_STATIC_URL)
            if (fileFullName) return reply.sendFile(pathFileName)
            return reply.code(404).send({
                error: "没有对应的文件"
            })
        },
    })
}
export default filename
