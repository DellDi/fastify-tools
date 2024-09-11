import dotenv from 'dotenv'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const currentEnv = process.env.NODE_ENV || 'development'

const basePath = path.resolve(__dirname, '.env')
const envPath = `${basePath}.${currentEnv}`

let envConfig = {}

if (fs.existsSync(envPath)) {
  envConfig = dotenv.parse(fs.readFileSync(envPath))
  console.log('Loaded environment variables:', envConfig)
  // Extend process.env with the loaded configuration
  Object.assign(process.env, envConfig)
  dotenv.config()
} else {
  console.error(
    `No environment configuration file found for environment: ${currentEnv}`
  )
  process.exit(1)
}

export default envConfig
