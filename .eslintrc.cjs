module.exports = {
  root: true,
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    node: true
  },
  extends: ['standard', 'plugin:vue/vue3-recommended'],
  globals: {
    __static: true
  },
  plugins: [
    'vue'
  ],
  rules: {
    'arrow-parens': 0,
    'generator-star-spacing': 0,
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-case-declarations': 0,
    'array-callback-return': 0,
    'no-trailing-spaces': 1,
    'no-control-regex': 0,
    'no-useless-constructor': 0,
    'node/no-deprecated-api': 0
  }
}
