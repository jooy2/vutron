import dotenv from 'dotenv'
import chalk from 'chalk'
import electron from 'electron'
import path from 'path'
import { spawn } from 'child_process'
import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import webpackHotMiddleware from 'webpack-hot-middleware'

import mainConfig from './config/webpack.main.mjs'
import rendererConfig from './config/webpack.renderer.mjs'
import { fileURLToPath } from 'url'

dotenv.config({ path: '.env.dev' })

const __dirname = path.dirname(fileURLToPath(import.meta.url))
let electronProcess = null
let manualRestart = false

function log (processName, data, color = 'yellow') {
  let strLog = ''

  if (typeof data === 'object') {
    data.toString().split(/\r?\n/).forEach(line => {
      strLog += ' ' + line + '\n'
    })
  } else {
    strLog += ` ${data}\n`
  }

  if (/[\dA-z]+/.test(strLog)) {
    console.log(`${chalk[color].bold(`[${processName}] >`)}${strLog}`)
  }
}

function startRenderer () {
  return new Promise(resolve => {
    (async () => {
      rendererConfig.entry.renderer = [path.join(__dirname, 'devClient.mjs'), rendererConfig.entry.renderer]

      const compiler = webpack({
        mode: 'development',
        ...rendererConfig
      })

      compiler.hooks.done.tap('done', stats => {
        log('Renderer', stats)
      })

      const server = new WebpackDevServer(
        {
          port: 9080,
          liveReload: true,
          static: {
            directory: path.join(__dirname, '../'),
            watch: {
              usePolling: true,
              ignored: /node_modules/
            }
          },
          setupMiddlewares (middlewares, devServer) {
            devServer.app.use(webpackHotMiddleware(compiler, {
              log: false,
              heartbeat: 5000
            }))
            devServer.middleware.waitUntilValid(() => {
              resolve()
            })

            return middlewares
          }
        },
        compiler
      )

      await server.start()
    })()
  })
}

function startMain () {
  return new Promise(resolve => {
    mainConfig.entry.main = [path.join(__dirname, '../src/main/index.dev.js'), mainConfig.entry.main]

    const compiler = webpack({
      mode: 'development',
      ...mainConfig
    })

    compiler.hooks.watchRun.tapAsync('watch-run', (compilation, done) => {
      log('Main', chalk.white.bold('Compiling...'))
      done()
    })

    compiler.watch({}, (err, stats) => {
      if (err) {
        console.log(err)
        return
      }

      log('Main', stats)

      if (electronProcess?.kill) {
        manualRestart = true
        process.kill(electronProcess.pid)
        electronProcess = null
        startElectron()

        setTimeout(() => {
          manualRestart = false
        }, 3500)
      }

      resolve()
    })
  })
}

function startElectron () {
  electronProcess = spawn(electron, [
    ...[
      '--inspect=5858',
      path.join(__dirname, '/../dist/electron/main.js')
    ],
    ...process.argv.slice(2)
  ])

  electronProcess.stdout.on('data', data => {
    log('Electron', data, 'blue')
  })

  electronProcess.stderr.on('data', data => {
    log('Electron', data, 'red')
  })

  electronProcess.on('close', () => {
    if (!manualRestart) {
      process.exit()
    }
  })
}

(async () => {
  try {
    await startRenderer()
    await startMain()
    startElectron()
  } catch (e) {
    console.error(e)
  }
})()
