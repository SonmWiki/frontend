/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  rules:{
    'vue/max-attributes-per-line': ['warn', {
      'singleline': {
        'max': 3
      },
      'multiline': {
        'max': 1
      }
    }]
  },
  parserOptions: {
    ecmaVersion: 'latest'
  }
}
