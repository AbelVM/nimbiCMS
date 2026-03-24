import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Increased temporarily to avoid intermittent 5s timeouts in CI
    testTimeout: 20000,
    include: ['tests/**/*.test.{js,ts}'],
    setupFiles: ['tests/setup.js'],
    coverage: {
      provider: 'v8'
    },
  },
})