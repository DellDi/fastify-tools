import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { spawn } from 'node:child_process'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('..', import.meta.url))
const envFile = resolve(root, '.env')
if (existsSync(envFile)) process.loadEnvFile(envFile)
const [service, command, ...args] = process.argv.slice(2)
const databaseUrl = service === 'fastify' ? process.env.FASTIFY_DATABASE_URL : service === 'next' ? process.env.NEXT_DATABASE_URL : undefined
if (databaseUrl) process.env.DATABASE_URL = databaseUrl
const requireFromProject = createRequire(resolve(process.cwd(), 'package.json'))
const bins = {
  prisma: () => requireFromProject.resolve('prisma/build/index.js'),
  next: () => requireFromProject.resolve('next/dist/bin/next'),
  tsc: () => requireFromProject.resolve('typescript/bin/tsc'),
  concurrently: () => resolve(requireFromProject.resolve('concurrently/package.json'), '../dist/bin/concurrently.js'),
  'ts-node': () => requireFromProject.resolve('ts-node/dist/bin.js'),
}
const executable = bins[command] || command === 'node' ? process.execPath : command
const commandArgs = bins[command] ? [bins[command](), ...args] : args
const child = spawn(executable, commandArgs, { stdio: 'inherit', shell: process.platform === 'win32' && executable !== process.execPath })
child.on('error', (error) => { console.error(error.message); process.exitCode = 1 })
child.on('exit', (code, signal) => { if (signal) process.kill(process.pid, signal); else process.exitCode = code ?? 1 })
