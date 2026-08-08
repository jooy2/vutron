import { defineConfig, globalIgnores } from 'eslint/config'
import pluginJs from '@eslint/js'
import pluginTypeScriptESLint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'
import parserTypeScript from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import pluginNode from 'eslint-plugin-n'
import pluginImport from 'eslint-plugin-import'
import pluginPrettier from 'eslint-plugin-prettier/recommended'

import globals from 'globals'
import { builtinModules } from 'module'

/*
 * `src/common` is bundled into the main, the preload and the renderer build
 * alike, so anything only one of them can run has to stay out of it. The
 * renderer has no Node.js and no Electron at runtime; the main process has no
 * DOM and no Vue. Type-only imports are erased at build time and are allowed.
 * */
const commonImportMessage =
  '`src/common` is shared by every process. Keep process specific code in `src/main`, `src/preload` or `src/renderer`.'

const commonRestrictedImportPaths = [
  ...builtinModules,
  'electron-log',
  'pinia',
  'vue',
  'vue-i18n',
  'vue-router',
  'vuetify'
].map((name) => ({ name, message: commonImportMessage }))

const commonRestrictedImportPatterns = [
  {
    group: [
      'node:*',
      'electron/*',
      'electron-log/*',
      'vuetify/*',
      '@/main/**',
      '@/preload/**',
      '@/renderer/**',
      '**/main/**',
      '**/preload/**',
      '**/renderer/**'
    ],
    message: commonImportMessage
  }
]

// Globals that exist in one process only. `process` is included because Vite
// inlines `process.env.NODE_ENV` for the renderer but nothing else of it.
const commonRestrictedGlobals = [
  '__dirname',
  '__filename',
  'document',
  'localStorage',
  'navigator',
  'process',
  'require',
  'sessionStorage',
  'window'
].map((name) => ({ name, message: commonImportMessage }))

export default defineConfig([
  pluginPrettier,
  pluginJs.configs.recommended,
  pluginTypeScriptESLint.configs.recommended,
  pluginImport.flatConfigs.electron,
  pluginNode.configs['flat/recommended-script'],
  ...pluginVue.configs['flat/strongly-recommended'],
  globalIgnores([
    '**/node_modules',
    '**/dist',
    '**/release',
    '**/docs',
    '**/.idea',
    '**/.vscode',
    '**/buildAssets/builder',
    '**/tests/results',
    '**/package-lock.json'
  ]),
  {
    files: ['**/*.{js,mjs,cjs,ts,vue}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parser: parserVue,
      parserOptions: {
        parser: parserTypeScript,
        ecmaFeatures: {
          jsx: true
        },
        requireConfigFile: false
      }
    },
    rules: {
      // override/add rules settings here, such as:
      eqeqeq: 'error',
      'no-unused-vars': 'off',
      'no-case-declarations': 'off',
      'no-trailing-spaces': 'error',
      'no-unsafe-optional-chaining': 'off',
      'no-control-regex': 'off',
      'n/no-missing-import': 'off',
      'n/no-unsupported-features/node-builtins': 'off',
      'vue/v-on-event-hyphenation': 'off',
      'vue/no-v-text-v-html-on-component': 'off',
      'vue/attribute-hyphenation': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 1
          },
          multiline: {
            max: 1
          }
        }
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  {
    // Keeps `src/common` runnable in every process, see the note above
    files: ['src/common/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            ...commonRestrictedImportPaths,
            {
              name: 'electron',
              message: `${commonImportMessage} Electron types are fine, import them with \`import type\`.`,
              allowTypeImports: true
            }
          ],
          patterns: commonRestrictedImportPatterns
        }
      ],
      'no-restricted-globals': ['error', ...commonRestrictedGlobals]
    }
  },
  {
    // The renderer talks to the main process through the preload bridge only.
    // Reaching into `src/main` would bundle main process code, Node.js imports
    // and all, into the web page.
    files: ['src/renderer/**/*.{ts,vue}'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'electron',
              message:
                'The renderer has no Electron at runtime. Go through `window.mainApi`, or share the code via `src/common`. Types are fine with `import type`.',
              allowTypeImports: true
            }
          ],
          patterns: [
            {
              group: ['@/main/**', '@/preload/**'],
              message:
                'The renderer cannot run main process code. Move what both sides need to `src/common`.'
            }
          ]
        }
      ]
    }
  },
  {
    files: ['src/main/**/*.ts', 'src/preload/**/*.ts'],
    rules: {
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/renderer/**'],
              message:
                'The main process cannot run renderer code. Move what both sides need to `src/common`.'
            }
          ]
        }
      ]
    }
  }
])
