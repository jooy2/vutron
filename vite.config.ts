import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import electronPlugin from 'vite-plugin-electron'
import rendererPlugin from 'vite-plugin-electron-renderer'
import eslintPlugin from 'vite-plugin-eslint'
import vuetifyPlugin from 'vite-plugin-vuetify'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

export default defineConfig(() => {
  rmSync('dist', { recursive: true, force: true })

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src')
      }
    },
    base: './',
    root: resolve('./src/renderer'),
    publicDir: resolve('./src/renderer/public'),
    clearScreen: false,
    build: {
      assetsDir: '', // See: https://github.com/electron-vite/electron-vite-vue/issues/287
      outDir: resolve('./dist')
    },
    plugins: [
      vue(),
      vueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      vuetifyPlugin({
        autoImport: true
      }),
      // Docs: https://github.com/gxmari007/vite-plugin-eslint
      eslintPlugin(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      electronPlugin([
        {
          entry: ['src/main/index.ts'],
          onstart: (options) => {
            options.startup()
          },
          vite: {
            build: {
              assetsDir: '.',
              outDir: 'dist/main',
              rollupOptions: {
                external: ['electron', ...builtinModules]
              }
            }
          }
        },
        {
          entry: ['src/preload/index.ts'],
          onstart: (options) => {
            options.reload()
          },
          vite: {
            build: {
              outDir: 'dist/preload'
            }
          }
        }
      ]),
      rendererPlugin()
    ]
  }
})
