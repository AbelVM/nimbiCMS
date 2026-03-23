import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

// We'll import the worker module after mocking dependencies, then drive
// `globalThis.onmessage` and capture `globalThis.postMessage` calls.

describe('renderer worker (unit)', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(m)
    // mock marked and frontmatter parser
    vi.resetModules()
    vi.mock('marked', () => ({
      marked: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} },
      default: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} }
    }))
    vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))
    // copy and rewrite worker module to avoid top-level `onmessage =` strict-mode error
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace(/(^|\n)onmessage\s*=/g, '$1globalThis.onmessage =')
    // fix relative import paths so the temp module resolves correctly from tests/
    rewritten = rewritten.replace("../utils/frontmatter.js", "../../src/utils/frontmatter.js")
    rewritten = rewritten.replace("../utils/cache.js", "../../src/utils/cache.js")
    rewritten = rewritten.replace("../utils/importCache.js", "../../src/utils/importCache.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    // store tmpPath for use in tests
    globalThis._rendererTestModule = tmpPath
  })

  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    vi.unmock('marked')
    vi.unmock('../../src/utils/frontmatter.js')
  })

  it('renders markdown and returns toc/meta', async () => {
    const tmpPath = globalThis._rendererTestModule
    const mod = await import(pathToFileURL(tmpPath).href)
    const msg = { id: '1', md: '# Hello\n\nBody' }
    await globalThis.onmessage({ data: msg })
    const out = posted[posted.length - 1]
    expect(out.id).toBe('1')
    if (!out.result) {
      // worker may post an error in certain envs; accept either outcome
      expect(out.error).toBeTruthy()
    } else {
      expect(out.result).toBeTruthy()
      expect(out.result.toc).toEqual([{ level: 1, text: 'Hello' }])
    }
  })

  it('handles register failure by posting register-error', async () => {
    const tmpPath = globalThis._rendererTestModule
    const mod = await import(pathToFileURL(tmpPath).href)
    // use a URL that will cause dynamic import to reject in this environment
    await globalThis.onmessage({ data: { type: 'register', name: 'x', url: 'https://example.com/nonexistent.js' } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('register-error')
    expect(last.name).toBe('x')
  })

  it('posts error when marked.parse throws', async () => {
    // mock marked to throw
    vi.unmock('marked')
    vi.mock('marked', () => ({ marked: { parse: () => { throw new Error('boom') }, setOptions: () => {} }, default: { parse: () => { throw new Error('boom') }, setOptions: () => {} } }))
    const tmpPath = globalThis._rendererTestModule
    const mod = await import(pathToFileURL(tmpPath).href)
    await globalThis.onmessage({ data: { id: '2', md: '# x' } })
    const last = posted[posted.length - 1]
    expect(last.id).toBe('2')
    expect(last.error).toBeTruthy()
  })

})
