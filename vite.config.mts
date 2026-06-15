import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import electron, { ElectronSimpleOptions } from 'vite-plugin-electron/simple'
import EslintPlugin from '@nabla/vite-plugin-eslint'
import VuetifyPlugin from 'vite-plugin-vuetify'
import VueJsx from '@vitejs/plugin-vue-jsx'
import Vue from '@vitejs/plugin-vue'
import { rmSync } from 'fs'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

const isDevEnv = process.env.NODE_ENV === 'development'
const projectRoot = dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ mode }) => {
  process.env = {
    ...(isDevEnv
      ? {
          ELECTRON_ENABLE_LOGGING: 'true'
        }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

  rmSync(resolve(projectRoot, 'dist'), { recursive: true, force: true })

  const electronPluginConfigs: ElectronSimpleOptions = {
    main: {
      entry: resolve(projectRoot, 'src/main/index.ts'),
      onstart({ startup }) {
        const debugArgs = [
          '.',
          '--inspect=9228',
          '--remote-debugging-port=9229'
        ]
        startup(debugArgs, { cwd: projectRoot })
      },
      vite: {
        root: resolve(projectRoot),
        base: './',
        publicDir: resolve(projectRoot, './src/public'),
        build: {
          sourcemap: true,
          assetsDir: '.',
          outDir: resolve(projectRoot, 'dist/main'),
          rolldownOptions: {
            external: ['electron', ...builtinModules]
          }
        }
      }
    },
    preload: {
      input: resolve(projectRoot, 'src/preload/index.ts'),
      vite: {
        build: {
          outDir: resolve(projectRoot, 'dist/preload')
        }
      }
    }
  }

  return {
    define: {
      __VUE_I18N_FULL_INSTALL__: true,
      __VUE_I18N_LEGACY_API__: false,
      __INTLIFY_PROD_DEVTOOLS__: false
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.vue', '.json', '.scss'],
      alias: {
        '@': resolve(projectRoot, 'src')
      }
    },
    base: './',
    root: resolve(projectRoot, 'src/renderer'),
    publicDir: resolve(projectRoot, 'src/public'),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve(projectRoot, 'dist')
    },
    plugins: [
      Vue(),
      VueJsx(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      VuetifyPlugin({
        autoImport: true
      }),
      // Docs: https://github.com/nabla/vite-plugin-eslint
      EslintPlugin(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      electron(electronPluginConfigs)
    ]
  }
})
