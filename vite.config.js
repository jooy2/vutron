import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import electronPlugin from 'vite-plugin-electron'
import rendererPlugin from 'vite-plugin-electron-renderer'
import eslintPlugin from 'vite-plugin-eslint'
import vuetifyPlugin from 'vite-plugin-vuetify'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vue from '@vitejs/plugin-vue'
import pkg from './package.json'
import { resolve, dirname } from 'path'
import { builtinModules } from 'module'

export default defineConfig({
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
	build: {
		outDir: resolve('./dist'),
		rollupOptions: {
			external: Object.keys(pkg.dependencies)
		}
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
					options.startup(['.', '--no-sandbox'])
				},
				vite: {
					publicDir: resolve('./src/main'),
					build: {
						emptyOutDir: true,
						assetsDir: '.',
						outDir: 'dist/main',
						rollupOptions: {
							external: ['electron', ...builtinModules]
						}
					}
				}
			}
		]),
		rendererPlugin({
			nodeIntegration: true
		})
	]
})
