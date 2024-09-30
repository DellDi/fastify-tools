import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.get('/', async function (request, reply) {
    let headers = request.headers
    return {
      headers: headers,
      'process.env': process.env,
    }
  })
}

export default example
