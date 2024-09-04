import { FastifyPluginAsync } from 'fastify'

type InputDataType = {
  point: string
  params: Record<string, any>
}

const dify: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.post<{ Body: InputDataType }>('/create-jira', {
    schema: {
      tags: ['dify'],
      body: {
        type: 'object',
        properties: {
          point: { type: 'string' },
          params: {
            type: 'object',
            additionalProperties: true,
          },
        },
        required: ['point'],
      },
    },
    handler: async (request, reply) => {
      const expectedApiKey = '123456' // TODO: Your API key for this API
      const authHeader = request.headers.authorization

      if (
        !authHeader ||
        !authHeader.toLowerCase().startsWith('bearer ') ||
        authHeader.split(' ')[1] !== expectedApiKey
      ) {
        reply.code(401).send({ error: 'Unauthorized' })
        return
      }

      const { point, params } = request.body

      // for debug
      fastify.log.info(`point: ${point}`)

      if (point === 'ping') {
        return { result: 'pong' }
      }

      if (point === 'app.external_data_tool.query') {
        return handleAppExternalDataToolQuery(params || {})
      }

      // TODO: other point implementations here

      reply.code(400).send({ error: 'Not implemented' })
    },
  })
}

function handleAppExternalDataToolQuery(params: Record<string, any>) {
  const { app_id, tool_variable, inputs, query } = params

  // for debug
  console.log(`app_id: ${app_id}`)
  console.log(`tool_variable: ${tool_variable}`)
  console.log(`inputs: ${JSON.stringify(inputs)}`)
  console.log(`query: ${query}`)

  // TODO: your external data tool query implementation here
  if (inputs?.location === 'London') {
    return {
      result:
        'City: London\nTemperature: 10°C\nRealFeel®: 8°C\nAir Quality: Poor\nWind Direction: ENE\nWind Speed: 8 km/h\nWind Gusts: 14 km/h\nPrecipitation: Light rain',
    }
  } else {
    return { result: 'Unknown city' }
  }
}

export default dify
