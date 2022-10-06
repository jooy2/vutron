import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import vue from '@vitejs/plugin-vue'
import { resolve, join } from 'path'

export default defineConfig({
  resolve: {
    extensions: [
      '.mjs',
      '.js',
      '.ts',
      '.vue',
      '.json',
      '.scss'
    ],
    alias: {
      '@': join(__dirname, 'src')
    }
  },
  base: './',
  root: resolve('./src/renderer'),
  publicDir: resolve('./src/renderer/public'),
  build: {
    outDir: resolve('./dist')
  },
  plugins: [
    vue(),
    electron({
      main: {
        entry: 'src/main/index.js',
        vite: {
          publicDir: resolve('./src/main'),
          build: {
            emptyOutDir: true,
            outDir: 'dist/main'
          }
        }
      },
      renderer: {}
    })
  ]
})
