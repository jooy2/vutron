import { defineConfig } from 'vite'
import electron from 'vite-plugin-electron'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import { resolve, join } from 'path'
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
    vueJsx(),
    electron({
      main: {
        entry: 'src/main/index.js',
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
