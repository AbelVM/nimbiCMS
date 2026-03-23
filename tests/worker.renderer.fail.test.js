import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

describe('renderer worker register failure when hljs core missing', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(m)
    vi.resetModules()
    vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s||'')}</p>` , setOptions: () => {} }, default: { parse: (s) => `<p>${String(s||'')}</p>` , setOptions: () => {} } }))
    vi.mock('../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))

    // create a local language module that would succeed if hljs present
    const langPath = path.resolve('tests/_lang_ok.mjs')
    fs.writeFileSync(langPath, 'export default function(){ return {} }', 'utf8')
    globalThis._langOk = langPath

    // rewrite worker module to assign globalThis.onmessage
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
    rewritten = rewritten.replace("../utils/frontmatter.js", "../src/utils/frontmatter.js")
    rewritten = rewritten.replace("../utils/cache.js", "../src/utils/cache.js")
    rewritten = rewritten.replace("../utils/importCache.js", "../src/utils/importCache.js")
    const tmp = path.resolve('tests/_renderer_test_fail.mjs')
    fs.writeFileSync(tmp, rewritten, 'utf8')
    globalThis._rendererFail = tmp

  })
  afterEach(() => {
    try { fs.unlinkSync(globalThis._langOk) } catch (_) {}
    try { fs.unlinkSync(globalThis._rendererFail) } catch (_) {}
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    vi.unmock('../src/utils/frontmatter.js')
    vi.unmock('marked')
  })

  it('posts register-error when hljs core import fails even if language module exists', async () => {
    // mock CDN core import to throw/fail
    vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => { throw new Error('no core') }, { virtual: true })
    const mod = await import(pathToFileURL(globalThis._rendererFail).href)
    const langUrl = pathToFileURL(globalThis._langOk).href
    await globalThis.onmessage({ data: { type: 'register', name: 'xlang', url: langUrl } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('register-error')
    expect(last.name).toBe('xlang')
  })
})
