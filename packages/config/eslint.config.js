/** @type {import('eslint').Linter.Config[]} */
const config = [
  {
    rules: {
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
]

module.exports = config
