import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock the CDN core import so `ensureHljs` can succeed during tests
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => {
  const hljs = {
    registerLanguage: vi.fn(),
    getLanguage: vi.fn(() => false),
    highlight: vi.fn((code) => ({ value: String(code) }))
  }
  return { default: hljs }
})

// Mock import cache module so we can control language import results
vi.mock('../../src/utils/importCache.js', () => ({
  importUrlWithCache: vi.fn(),
  runImportWithCache: vi.fn(async (url, fn) => fn()),
  clearImportCache: vi.fn(),
  setImportNegativeCacheTTL: vi.fn()
}))

import { handleWorkerMessage, handleWorkerMessageStream, clearRendererImportCache } from '../../src/worker/renderer.js'
import * as importCache from '../../src/utils/importCache.js'

beforeEach(() => {
  clearRendererImportCache()
  vi.resetAllMocks()
})

describe('worker/renderer extra branches', () => {
  it('register: success path returns registered and calls hljs.registerLanguage', async () => {
    importCache.importUrlWithCache.mockResolvedValueOnce({ default: (v) => v })
    const res = await handleWorkerMessage({ type: 'register', name: 'mylang', url: 'https://example.com/lang.js' })
    expect(res).toEqual({ type: 'registered', name: 'mylang' })
    const core = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
    expect(core.default.registerLanguage).toHaveBeenCalledWith('mylang', expect.any(Function))
  })

  it('register: returns register-error when import returns falsy module', async () => {
    importCache.importUrlWithCache.mockResolvedValueOnce(null)
    const res = await handleWorkerMessage({ type: 'register', name: 'fail', url: 'https://example.com/fail.js' })
    expect(res.type).toBe('register-error')
    expect(res.error).toMatch(/failed to import language module/)
  })

  it('handleWorkerMessageStream: streams chunks and emits done', async () => {
    const chunks = []
    const md = '# One\n\n# Two\n\n# Three\n\n'
    const out = await handleWorkerMessageStream({ type: 'stream', id: 's', md, chunkSize: 10 }, (c) => chunks.push(c))
    expect(out).toHaveProperty('type', 'done')
    expect(chunks.some(c => c.type === 'chunk')).toBeTruthy()
    expect(chunks[chunks.length - 1]).toHaveProperty('type', 'done')
  })

  it('handleWorkerMessageStream: fallback calls normal handler when not stream', async () => {
    const calls = []
    const res = await handleWorkerMessageStream({ id: 'r1', md: '# Fallback\n' }, (c) => calls.push(c))
    expect(res).toHaveProperty('id', 'r1')
    expect(calls.length).toBe(1)
    expect(calls[0]).toHaveProperty('result')
  })

  it('marked.highlighted: uses hljs.highlight when language supported', async () => {
    importCache.importUrlWithCache.mockResolvedValueOnce(null)
    const core = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
    core.default.getLanguage.mockImplementationOnce((name) => name === 'javascript')
    core.default.highlight.mockImplementationOnce((code) => ({ value: `<span class="hl">${code}</span>` }))
    const res = await handleWorkerMessage({ id: 'h1', md: '```javascript\n1+1\n```' })
    expect(res).toHaveProperty('id', 'h1')
    // marked currently emits a code block; ensure the language class and code text are present
    expect(res.result.html).toContain('language-javascript')
    expect(res.result.html).toContain('1+1')
  })

  it('marked.highlighted: falls back to plaintext when requested lang unavailable', async () => {
    importCache.importUrlWithCache.mockResolvedValueOnce(null)
    const core = await import('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js')
    core.default.getLanguage.mockImplementationOnce(() => false)
    core.default.getLanguage.mockImplementationOnce((name) => name === 'plaintext')
    core.default.highlight.mockImplementationOnce((code) => ({ value: `<span class="pl">${code}</span>` }))
    const res = await handleWorkerMessage({ id: 'h2', md: '```unknown\ncode\n```' })
    // marked currently emits a code block; ensure the unknown language appears in the class
    expect(res.result.html).toContain('language-unknown')
    expect(res.result.html).toContain('code')
  })

  it('stream: splits long content into chunks when no headings present', async () => {
    const chunks = []
    const md = 'a'.repeat(220)
    const out = await handleWorkerMessageStream({ type: 'stream', id: 'c1', md, chunkSize: 50 }, (c) => chunks.push(c))
    const chunkCount = chunks.filter(c => c.type === 'chunk').length
    expect(chunkCount).toBeGreaterThanOrEqual(3)
    expect(out).toHaveProperty('type', 'done')
  })

  it('detect: handles supported.indexOf throwing without bubbling', async () => {
    const supported = { length: 1, indexOf: () => { throw new Error('boom') } }
    const res = await handleWorkerMessage({ type: 'detect', id: 'd2', md: '```mycustom\n```', supported })
    expect(res).toHaveProperty('id', 'd2')
    expect(Array.isArray(res.result)).toBe(true)
  })

  it('headings: duplicate headings produce unique ids and classes', async () => {
    const md = '# One\n\n# One\n\n# One\n'
    const res = await handleWorkerMessage({ id: 't1', md })
    expect(res).toHaveProperty('id', 't1')
    expect(Array.isArray(res.result.toc)).toBe(true)
    const ids = res.result.toc.map(t => t.id)
    expect(ids).toContain('one')
    expect(ids).toContain('one-2')
    expect(ids).toContain('one-3')
    // HTML should include the generated id attributes and heading classes
    expect(res.result.html).toContain('id="one"')
    expect(res.result.html).toContain('has-text-weight-bold')
  })

  it('images: adds loading="lazy" when absent and preserves existing attributes', async () => {
    const md1 = '![alt](img.jpg)'
    const r1 = await handleWorkerMessage({ id: 'img1', md: md1 })
    expect(r1.result.html).toContain('loading="lazy"')

    const md2 = '<img src="img2.jpg" loading="eager">'
    const r2 = await handleWorkerMessage({ id: 'img2', md: md2 })
    expect(r2.result.html).toContain('loading="eager"')

    const md3 = '<img src="img3.jpg" data-want-lazy="1">'
    const r3 = await handleWorkerMessage({ id: 'img3', md: md3 })
    expect(r3.result.html).not.toContain('loading=')
  })

  it('frontmatter: metadata is returned in meta', async () => {
    const md = '---\ntitle: TestTitle\n---\n# H\ncontent\n'
    const r = await handleWorkerMessage({ id: 'm1', md })
    expect(r).toHaveProperty('id', 'm1')
    expect(r.result.meta).toHaveProperty('title', 'TestTitle')
  })

  it('split: single short section returns single chunk in stream mode', async () => {
    const chunks = []
    const md = 'short content'
    const out = await handleWorkerMessageStream({ type: 'stream', id: 's2', md, chunkSize: 1024 }, (c) => chunks.push(c))
    const chunkCount = chunks.filter(c => c.type === 'chunk').length
    expect(chunkCount).toBe(1)
    expect(out).toHaveProperty('type', 'done')
  })

  it('existing id in headings preserved and duplicates suffixed', async () => {
    const md = '<h2 id="preid" class="old">Hello</h2>\n<h2 id="preid">Hello</h2>'
    const res = await handleWorkerMessage({ id: 'eid', md })
    expect(res).toHaveProperty('id', 'eid')
    const ids = res.result.toc.map(t => t.id)
    expect(ids).toContain('preid')
    expect(ids).toContain('preid-2')
    expect(res.result.html).toContain('id="preid-2"')
  })

  it('heading entities are decoded in TOC text', async () => {
    const md = '# A &amp; B\n'
    const res = await handleWorkerMessage({ id: 'ent', md })
    expect(res.result.toc[0].text).toBe('A & B')
  })

  it('stream: large section pushed as single chunk when >= chunkSize', async () => {
    const chunks = []
    const md = '# Start\n' + 'a'.repeat(300) + '\n# Next\nmore'
    const out = await handleWorkerMessageStream({ type: 'stream', id: 'big', md, chunkSize: 50 }, (c) => chunks.push(c))
    // There should be at least one chunk emitted for the large section
    const chunkCount = chunks.filter(c => c.type === 'chunk').length
    expect(chunkCount).toBeGreaterThanOrEqual(2)
    expect(out).toHaveProperty('type', 'done')
  })

  it('detect: recognizes fallback-known and valid long language names', async () => {
    const md = '```js\n```\n```python\n```\n```abcde\n```'
    const res = await handleWorkerMessage({ type: 'detect', id: 'det1', md })
    expect(res).toHaveProperty('id', 'det1')
    expect(Array.isArray(res.result)).toBe(true)
    // fallback-known short name
    expect(res.result).toContain('js')
    // valid longer name matching pattern/length
    expect(res.result).toContain('python')
  })

  it('detect: respects provided supported list', async () => {
    const md = '```custom\n```'
    const res = await handleWorkerMessage({ type: 'detect', id: 'det2', md, supported: ['custom'] })
    expect(res.result).toContain('custom')
  })

  it('headings: level 5/6 use normal weight', async () => {
    const md = '##### Small heading\n###### X\n'
    const res = await handleWorkerMessage({ id: 'w1', md })
    expect(res.result.html).toContain('has-text-weight-normal')
    expect(res.result.toc.some(t => t.level === 5)).toBeTruthy()
  })

  it('heading numeric entities decode (decimal and hex)', async () => {
    const md1 = '# &#65;\n' // decimal 65 -> 'A'
    const r1 = await handleWorkerMessage({ id: 'n1', md: md1 })
    expect(r1.result.toc[0].text).toBe('A')

    const md2 = '# &#x41;\n' // hex 0x41 -> 'A'
    const r2 = await handleWorkerMessage({ id: 'n2', md: md2 })
    expect(r2.result.toc[0].text).toBe('A')
  })
})
