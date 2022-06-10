import './env.mjs'
import chalk from 'chalk'
import webpack from 'webpack'
import Listr from 'listr'
import { performance } from 'perf_hooks'
import _ from 'qsu'
import FsMan from 'fsman'
import mainConfig from '../config/webpack.main.mjs'
import rendererConfig from '../config/webpack.renderer.mjs'

const TAG_ERROR = `${chalk.bgRed.white(' ERROR ')} `
const TAG_SUCCESS = `${chalk.bgGreen.white(' SUCCESS ')} `

async function build () {
  FsMan.empty('dist/electron')

  let results = ''

  const tasks = new Listr(
    [
      {
        title: 'building main process',
        task: async () => {
          await pack(mainConfig)
            .then(result => {
              results += result + '\n\n'
            })
            .catch(err => {
              console.log(`\n  ${TAG_ERROR}failed to build main process`)
              console.error(`\n${err}\n`)
            })
        }
      },
      {
        title: 'building renderer process',
        task: async () => {
          await pack(rendererConfig)
            .then(result => {
              results += result + '\n\n'
            })
            .catch(err => {
              console.log(`\n  ${TAG_ERROR}failed to build renderer process`)
              console.error(`\n${err}\n`)
            })
        }
      }
    ],
    {
      concurrent: 2
    }
  )

  await tasks.run()
    .catch(() => {
      process.exit(1)
    })

  process.stdout.write('\x1B[2J\x1B[0f')
  console.log(`
    \n\n${results}
    ${TAG_SUCCESS}Wait for ${chalk.greenBright('`electron-builder`')} process...
    ${TAG_SUCCESS}${chalk.yellowBright(`Webpack Build Time: ${_.msToTime(performance.now())}`)}\n
  `)
  process.exit()
}

function pack (config) {
  return new Promise((resolve, reject) => {
    config.mode = 'production'

    webpack(config, (err, stats) => {
      if (err) {
        reject(err.stack || err)
      } else if (stats.hasErrors()) {
        let err = ''

        stats.toString({
          chunks: false,
          colors: true
        })
          .split(/\r?\n/)
          .forEach(line => {
            err += `    ${line}\n`
          })

        reject(err)
      } else {
        resolve(stats.toString({
          chunks: false,
          colors: true
        }))
      }
    })
  })
}

(async () => {
  performance.now()
  await build()
})()
