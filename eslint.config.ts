import { globalIgnores } from 'eslint/config'
import pluginJs from '@eslint/js'
import pluginTypeScriptESLint from 'typescript-eslint'
import parserVue from 'vue-eslint-parser'
import parserTypeScript from '@typescript-eslint/parser'
import pluginVue from 'eslint-plugin-vue'
import pluginNode from 'eslint-plugin-n'
import pluginImport from 'eslint-plugin-import'
import configPrettier from 'eslint-config-prettier'

import globals from 'globals'

export default pluginTypeScriptESLint.config(
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
        ecmaVersion: 2022,
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
      '@typescript-eslint/no-explicit-any': 'off'
    }
  },
  configPrettier
)
