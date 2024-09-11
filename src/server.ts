import process from 'node:process'
import Fastify from 'fastify'
import closeWithGrace from 'close-with-grace'
import './process.env.js'

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: 'debug',
  },
})

// Register your application as a normal plugin.
app.register(import('./app.js'))

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
  { delay: parseInt(process.env.FASTIFY_CLOSE_GRACE_DELAY || '500') },
  async function ({ signal, err, manual }) {
    if (err) {
      app.log.error({signal, err, manual})
    }
    await app.close()
  }
)

// Start listening.
app.listen({ port: parseInt(process.env.PORT || '3000') }, (err) => {
  console.log('🚀 ~ app.listen ~ process.env:', process.env)
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
