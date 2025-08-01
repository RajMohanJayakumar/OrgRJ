#!/usr/bin/env node

/**
 * Development script to run all apps concurrently
 */

import { spawn } from 'child_process'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

// Check if finclamp should be excluded
const excludeFinclamp = process.argv.includes('--exclude-finclamp')

const allApps = [
  { name: 'finclamp', port: 5173, color: '\x1b[36m' }, // Cyan
  { name: 'arcade-games', port: 5174, color: '\x1b[33m' },        // Yellow
  { name: 'engaged', port: 5175, color: '\x1b[35m' },         // Magenta
  { name: 'skips', port: 5176, color: '\x1b[32m' }          // Green
]

const apps = excludeFinclamp
  ? allApps.filter(app => app.name !== 'finclamp')
  : allApps

const reset = '\x1b[0m'

const modeText = excludeFinclamp
  ? '🚀 Starting apps in development mode (excluding finclamp - deployed on GitHub Pages)...\n'
  : '🚀 Starting all apps in development mode...\n'

console.log(modeText)

const processes = apps.map(app => {
  console.log(`${app.color}Starting ${app.name} on port ${app.port}${reset}`)
  
  const child = spawn('npm', ['run', 'dev'], {
    cwd: join(rootDir, 'apps', app.name),
    stdio: 'pipe'
  })

  child.stdout.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim())
    lines.forEach(line => {
      console.log(`${app.color}[${app.name}]${reset} ${line}`)
    })
  })

  child.stderr.on('data', (data) => {
    const lines = data.toString().split('\n').filter(line => line.trim())
    lines.forEach(line => {
      console.log(`${app.color}[${app.name}]${reset} ${line}`)
    })
  })

  child.on('close', (code) => {
    console.log(`${app.color}[${app.name}]${reset} Process exited with code ${code}`)
  })

  return { name: app.name, process: child }
})

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down all processes...')
  processes.forEach(({ name, process }) => {
    console.log(`Stopping ${name}...`)
    process.kill('SIGINT')
  })
  process.exit(0)
})

console.log('\n📱 Apps will be available at:')
apps.forEach(app => {
  console.log(`${app.color}  ${app.name}: http://localhost:${app.port}${reset}`)
})
console.log('\nPress Ctrl+C to stop all processes\n')
