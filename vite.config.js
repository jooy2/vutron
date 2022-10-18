import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import electronPlugin from 'vite-plugin-electron'
import eslintPlugin from 'vite-plugin-eslint'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false
  },
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
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src')
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
    vueJsx(),
    eslintPlugin(),
    electronPlugin({
      main: {
        entry: 'src/main/index.ts',
        vite: {
          publicDir: resolve('./src/main'),
          build: {
            emptyOutDir: true,
            assetsDir: '.',
            outDir: 'dist/main',
            rollupOptions: {
              external: [
                'electron',
                ...builtinModules
              ]
            }
          }
        }
      },
      renderer: {}
    })
  ]
})
