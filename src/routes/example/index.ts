import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/example', async function (request, reply) {
    let params = request.headers
    return {
      params: params,
    }
  })
}

export default example
