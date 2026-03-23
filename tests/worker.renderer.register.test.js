import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

describe('renderer worker register-success', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(m)
    vi.resetModules()
    // mock frontmatter and marked similarly to other tests
    vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))
    vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} }, default: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} } }))
    // prepare a local language module file
    const langPath = path.resolve('tests/worker/_lang_test_module.mjs')
    fs.writeFileSync(langPath, 'export default function(){ return {} }', 'utf8')
    globalThis._langTestModule = langPath

    // create rewritten worker module (assign to globalThis.onmessage)
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
      let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
      rewritten = rewritten.replace("../utils/frontmatter.js", "../../src/utils/frontmatter.js")
      rewritten = rewritten.replace("../utils/cache.js", "../../src/utils/cache.js")
      rewritten = rewritten.replace("../utils/importCache.js", "../../src/utils/importCache.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_reg.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    globalThis._rendererRegModule = tmpPath
  })
  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(globalThis._langTestModule) } catch(_) {}
    try { fs.unlinkSync(globalThis._rendererRegModule) } catch(_) {}
    vi.unmock('../../src/utils/frontmatter.js')
    vi.unmock('marked')
  })

  it('register posts registered when language module loads and hljs core is available', async () => {
    // mock the CDN core import used by ensureHljs
    vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({ default: { registerLanguage: () => {}, getLanguage: () => false } }), { virtual: true })
    const tmpPath = globalThis._rendererRegModule
    const mod = await import(pathToFileURL(tmpPath).href)
    // send register with local file URL
    const langUrl = pathToFileURL(globalThis._langTestModule).href
    await globalThis.onmessage({ data: { type: 'register', name: 'xlang', url: langUrl } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('registered')
    expect(last.name).toBe('xlang')
  })
})
