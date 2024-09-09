// Read the .env file.
import process from 'node:process'
import * as dotenv from 'dotenv'
dotenv.config()

// Require the framework
import Fastify from 'fastify'

// Require library to exit fastify process, gracefully (if possible)
import closeWithGrace from 'close-with-grace'

// Instantiate Fastify with some config
const app = Fastify({
  logger: {
    level: 'debug'
  },
})

// Register your application as a normal plugin.
app.register(import('./app.js'))

// delay is the number of milliseconds for the graceful close to finish
closeWithGrace(
  { delay: parseInt(process.env?.FASTIFY_CLOSE_GRACE_DELAY || '500') },
  async function ({ signal, err, manual }) {
    console.log('🚀 ~ signal:', signal, manual)
    if (err) {
      app.log.error(err)
    }

    await app.close()
  } as closeWithGrace.CloseWithGraceAsyncCallback
)

// Start listening.

app.listen({ port: parseInt(process.env.PORT || '3000') }, (err) => {
  if (err) {
    app.log.error(err)
    process.exit(1)
  }
})
