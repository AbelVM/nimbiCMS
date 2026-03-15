import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

describe('renderer worker edges', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(m)
    vi.resetModules()
    vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: { foo: 'bar' } }) }))
    vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} }, default: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} } }))
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
    rewritten = rewritten.replace("../utils/frontmatter.js", "../../src/utils/frontmatter.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_edge.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    globalThis._rendererEdgeModule = tmpPath
  })
  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(globalThis._rendererEdgeModule) } catch(_) {}
    vi.unmock('../../src/utils/frontmatter.js')
    vi.unmock('marked')
  })

  it('posts result containing meta when frontmatter present', async () => {
    const mod = await import(pathToFileURL(globalThis._rendererEdgeModule).href)
    const msg = { id: 'edge1', md: '---\nfoo: bar\n---\n# H' }
    await globalThis.onmessage({ data: msg })
    const last = posted[posted.length - 1]
    expect(last.result).toBeTruthy()
    expect(last.result.meta && last.result.meta.foo === 'bar').toBe(true)
  })

  it('register posts register-error when ensureHljs fails', async () => {
    // simulate ensureHljs failing by mocking CDN core import to throw
    vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => { throw new Error('no core') }, { virtual: true })
    const mod = await import(pathToFileURL(globalThis._rendererEdgeModule).href)
    await globalThis.onmessage({ data: { type: 'register', name: 'x', url: 'https://example.com/lang.js' } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('register-error')
  })
})
