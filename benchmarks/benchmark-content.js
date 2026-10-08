#!/usr/bin/env node
import { performance } from 'node:perf_hooks'
import { createServer } from 'vite'

const sizes = [100, 1000, 10000]
const budgets = new Map([
  [100, { elapsedMs: 5000, heapDeltaBytes: 64 * 1024 * 1024 }],
  [1000, { elapsedMs: 10000, heapDeltaBytes: 128 * 1024 * 1024 }],
  [10000, { elapsedMs: 30000, heapDeltaBytes: 256 * 1024 * 1024 }],
])

const vite = await createServer({
  server: { middlewareMode: true },
  logLevel: 'error',
})
const { buildSearchIndex } = await vite.ssrLoadModule(
  new URL('../src/slugSearchRuntime.js', import.meta.url).pathname,
)

try {
  for (const size of sizes) {
    const paths = Array.from({ length: size }, (_, index) => `page-${index}.md`)
    const directory = paths.map((path) => `<a href="${path}">${path}</a>`).join('')
    globalThis.fetch = async (url) => {
      const value = String(url)
      if (value.endsWith('/content/')) {
        return { ok: true, status: 200, text: async () => directory }
      }
      const path = value.slice(value.lastIndexOf('/') + 1)
      return {
        ok: true,
        status: 200,
        text: async () => `# ${path.replace(/\.md$/, '')}\n\nBenchmark page ${path}`,
      }
    }
    const started = performance.now()
    const before = process.memoryUsage().heapUsed
    const index = await buildSearchIndex('http://benchmark.test/content/', 1)
    const elapsedMs = performance.now() - started
    const heapDeltaBytes = process.memoryUsage().heapUsed - before
    console.log(JSON.stringify({ size, entries: index.length, elapsedMs: Math.round(elapsedMs), heapDeltaBytes }))
    const budget = budgets.get(size)
    if (elapsedMs > budget.elapsedMs || heapDeltaBytes > budget.heapDeltaBytes) {
      throw new Error(`content benchmark budget exceeded for ${size} pages`)
    }
  }
} finally {
  await vite.close()
}
