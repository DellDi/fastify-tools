import fp from 'fastify-plugin'
import scalarReference from '@scalar/fastify-api-reference'

export default fp<scalarReference>(async (fastify, opts) => {
  // Register other plugins with options
  fastify.register(scalarReference, {
    routePrefix: '/docs',
  })
})
