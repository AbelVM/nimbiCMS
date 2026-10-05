import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    // Increased temporarily to avoid intermittent 5s timeouts in CI
    testTimeout: 20000,
    include: ['tests/**/*.test.{js,ts}'],
    setupFiles: ['tests/setup.js'],
    // Vitest 5 defaults clearMocks to true (resets mock state before every
    // test). The existing suite records mock call history across tests, so
    // pin to false to preserve the established behavior.
    clearMocks: false,
    coverage: {
      provider: 'v8'
    },
  },
})