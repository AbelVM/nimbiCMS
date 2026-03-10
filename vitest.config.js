import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    testTimeout: 5000,
    include: ['tests/**/*.test.{js,ts}'],
  },
})