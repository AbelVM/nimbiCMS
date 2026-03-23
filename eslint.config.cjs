module.exports = [
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        history: 'readonly',
        location: 'readonly',
        navigator: 'readonly',
        fetch: 'readonly',
        URL: 'readonly',
        Element: 'readonly'
      }
    },
    plugins: {
      'unused-imports': require('eslint-plugin-unused-imports'),
      'nimbi-debug': require('./eslint-plugin-nimbi-debug/index.cjs')
    },
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'unused-imports/no-unused-imports': 'warn',
      'unused-imports/no-unused-vars': ['warn', { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' }],
      'no-console': 'off',
      'nimbi-debug/no-eager-debug': 'warn'
    }
  }
]
