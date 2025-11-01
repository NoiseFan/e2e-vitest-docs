import antfu from '@antfu/eslint-config'
import playwright from 'eslint-plugin-playwright'

export default antfu({
  formatters: true,
  typescript: true,
  test: {
    overrides: {
      'test/padding-around-after-all-blocks': 'error',
      'test/padding-around-after-each-blocks': 'error',
      'test/padding-around-before-all-blocks': 'error',
      'test/padding-around-before-each-blocks': 'error',
      'test/padding-around-describe-blocks': 'error',
      'test/padding-around-test-blocks': 'error',
    },
  },
  rules: {
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'ts/consistent-type-definitions': ['error', 'type'],
  },
}, {
  // @see https://github.com/mskelton/eslint-plugin-playwright
  name: 'playwright',
  ...playwright.configs['flat/recommended'],
  files: ['**/*.spec.ts'],
  rules: {
    ...playwright.configs['flat/recommended'].rules,
    'playwright/no-networkidle': 'off',
    'playwright/expect-expect': 'off',
    'playwright/no-conditional-in-test': 'off',
  },
})
