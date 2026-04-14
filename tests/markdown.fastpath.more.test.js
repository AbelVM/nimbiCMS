import { afterEach, describe, expect, it, vi } from 'vitest'

describe('markdown fast-path branches', () => {
  const originalVitest = process.env.VITEST

  afterEach(() => {
    process.env.VITEST = originalVitest
    vi.restoreAllMocks()
  })

  it('uses non-worker fast path when not in VITEST and no fenced code', async () => {
    process.env.VITEST = ''
    vi.resetModules()
    const md = await import('../src/markdown.js')

    const out = await md.parseMarkdownToHtml('# Title\n\n![img](a.png)\n\n## Section\n\nText')
    expect(String(out.html)).toContain('loading="lazy"')
    expect(Array.isArray(out.toc)).toBe(true)
    expect(out.toc.length).toBeGreaterThan(0)
    expect(out.toc[0].id).toBeTruthy()
  })

  it('uses highlighted fallback path for fenced blocks when not in VITEST', async () => {
    process.env.VITEST = ''
    vi.resetModules()
    const md = await import('../src/markdown.js')

    const out = await md.parseMarkdownToHtml('```\nconst x = 1\n```\n\n## Heading')
    expect(String(out.html)).toContain('<pre>')
    expect(Array.isArray(out.toc)).toBe(true)
  })

  it('still renders fenced code when worker is unavailable in non-VITEST mode', async () => {
    process.env.VITEST = ''
    vi.resetModules()
    const md = await import('../src/markdown.js')

    const oldWorker = globalThis.Worker
    try {
      delete globalThis.Worker
      const out = await md.parseMarkdownToHtml('```js\nconsole.log(1)\n```')
      expect(String(out.html)).toContain('<pre>')
    } finally {
      globalThis.Worker = oldWorker
    }
  })
})
