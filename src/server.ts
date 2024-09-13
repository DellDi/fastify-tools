import Fastify from 'fastify'
import closeWithGrace from 'close-with-grace'

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: 'info',
  },
})

// Register your application as a normal plugin.
await app.register(import('./app.js'))

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
  { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error({ signal, err, manual })
    }
    await app.close()
  }
)

// Start listening.
// app.listen({ port: parseInt('8888') }, (err) => {
//   if (err) {
//     app.log.error(err)
//     process.exit(1)
//   }
// })

export default async function handler(req: any, res: any) {
  console.log('🚀 ~ handler ~ req, res:', req, res)
  await app.ready()
  app.server.emit('request', req, res)
}
