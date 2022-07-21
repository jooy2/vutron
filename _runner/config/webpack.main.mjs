import { join, dirname } from 'path'
import packageJson from '../../package.json' assert { type: 'json' }
import webpack from 'webpack'

import TerserPlugin from 'terser-webpack-plugin'
import eslintFriendlyFormatter from 'eslint-friendly-formatter'
import ESLintPlugin from 'eslint-webpack-plugin'
import { fileURLToPath } from 'url'

process.env.BABEL_ENV = 'main'

const IS_DEV_ENV = process.env.NODE_ENV !== 'production'
const __dirname = dirname(fileURLToPath(import.meta.url))

export default {
  entry: {
    main: join(__dirname, '../../src/main/index.js')
  },
  externals: [
    ...Object.keys(packageJson.dependencies || {})
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.node$/,
        use: 'node-loader'
      }
    ]
  },
  node: {
    __dirname: IS_DEV_ENV,
    __filename: IS_DEV_ENV
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: join(__dirname, '../../dist/electron')
  },
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()]
  },
  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new ESLintPlugin({
      extensions: ['js'],
      formatter: eslintFriendlyFormatter()
    }),
    new webpack.DefinePlugin({
      ...IS_DEV_ENV
        ? {
            __static: `"${join(__dirname, '../../static').replace(/\\/g, '\\\\')}"`
          }
        : {},
      ...IS_DEV_ENV
        ? {}
        : {
            'process.env.NODE_ENV': '"production"'
          }
    })
  ],
  resolve: {
    extensions: ['.js', '.json', '.node']
  },
  target: 'electron-main'
}
