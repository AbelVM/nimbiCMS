import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { u82o } from '../node_modules/performance-helpers/src/helpers/powerBuffer.js'

function decodePosted(m) {
  if (m instanceof Uint8Array || (ArrayBuffer.isView && ArrayBuffer.isView(m))) {
    try { return u82o(m) } catch (_) {}
  }
  return m
}

describe('renderer worker register-success (idempotent)', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(decodePosted(m))
    vi.resetModules()
    // mock frontmatter and marked reasonably
    vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))
    vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} }, default: { parse: (s) => `<p>${String(s||'')}</p>`, setOptions: () => {} } }))

    // prepare a local language module file
    const langPath = path.resolve('tests/worker/_lang_test_module2.mjs')
    fs.writeFileSync(langPath, 'export default function(){ return {name: "xlang"} }', 'utf8')
    globalThis._langTestModule2 = langPath

    // create rewritten worker module (assign to globalThis.onmessage)
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
      let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
      rewritten = rewritten.replace("../utils/frontmatter.js", "../../src/utils/frontmatter.js")
      rewritten = rewritten.replace("../utils/cache.js", "../../src/utils/cache.js")
      rewritten = rewritten.replace("../utils/importCache.js", "../../src/utils/importCache.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_reg2.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    globalThis._rendererRegModule2 = tmpPath
  })
  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(globalThis._langTestModule2) } catch(_) {}
    try { fs.unlinkSync(globalThis._rendererRegModule2) } catch(_) {}
    vi.unmock('../../src/utils/frontmatter.js')
    vi.unmock('marked')
  })

  it('posts registered when language module loads; repeated register still posts registered', async () => {
    // mock the CDN core import used by ensureHljs
    vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({ default: { registerLanguage: () => {}, getLanguage: () => false } }), { virtual: true })
    const tmpPath = globalThis._rendererRegModule2
    const mod = await import(pathToFileURL(tmpPath).href)
    const langUrl = pathToFileURL(globalThis._langTestModule2).href
    await globalThis.onmessage({ data: { type: 'register', name: 'xlang', url: langUrl } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('registered')
    expect(last.name).toBe('xlang')

    // send register again; should register or at least reply registered/error consistently
    await globalThis.onmessage({ data: { type: 'register', name: 'xlang', url: langUrl } })
    const last2 = posted[posted.length - 1]
    expect(last2.type).toBe('registered')
    expect(last2.name).toBe('xlang')
  })
})
