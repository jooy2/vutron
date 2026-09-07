import { fileURLToPath } from 'url'
import { defineConfig, loadEnv } from 'vite'
import electron, { ElectronSimpleOptions } from 'vite-plugin-electron/simple'
import EslintPlugin from '@nabla/vite-plugin-eslint'
import VuetifyPlugin from 'vite-plugin-vuetify'
import Vue from '@vitejs/plugin-vue'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

const projectRoot = dirname(fileURLToPath(import.meta.url))

// Each Electron process is bundled on its own, so every build needs its own
// copy of the alias. `src/common` also sits outside the renderer `root` below
// and is reached through `@` rather than a relative path out of that root.
const sourceAlias = { '@': resolve(projectRoot, 'src') }

export default defineConfig(({ mode }) => {
  // `mode` is what Vite resolved for this run. `process.env.NODE_ENV` is not
  // guaranteed to be set yet while this config file is being evaluated.
  const isDevEnv = mode === 'development'

  process.env = {
    ...(isDevEnv
      ? {
          ELECTRON_ENABLE_LOGGING: 'true'
        }
      : {}),
    ...process.env,
    ...loadEnv(mode, process.cwd())
  }

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
        // The renderer build already copies `src/public` to `dist`, which is
        // where `Constants.PUBLIC_PATH` points. Copying it again would leave a
        // second unused set of assets under `dist/main`.
        publicDir: false,
        resolve: {
          alias: sourceAlias
        },
        build: {
          // Matches the renderer. Shipping main process sourcemaps would put
          // the original sources inside the packaged app.
          sourcemap: isDevEnv,
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
        resolve: {
          alias: sourceAlias
        },
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
      alias: sourceAlias
    },
    base: './',
    root: resolve(projectRoot, 'src/renderer'),
    publicDir: resolve(projectRoot, 'src/public'),
    clearScreen: false,
    build: {
      sourcemap: isDevEnv,
      minify: !isDevEnv,
      outDir: resolve(projectRoot, 'dist'),
      // `dist` sits outside the renderer `root`, so Vite skips the cleanup
      // unless it is asked for. The renderer builds before the main and the
      // preload process, so this cannot wipe what those two just wrote.
      emptyOutDir: true
    },
    plugins: [
      Vue(),
      // Docs: https://github.com/vuetifyjs/vuetify-loader
      VuetifyPlugin({
        autoImport: true
      }),
      // Docs: https://github.com/nabla/vite-plugin-eslint
      // The plugin declares `apply: 'serve'`, so it lints on the dev server
      // only. `build:pre` runs `npm run lint` to cover the build.
      EslintPlugin(),
      // Docs: https://github.com/electron-vite/vite-plugin-electron
      electron(electronPluginConfigs)
    ]
  }
})
