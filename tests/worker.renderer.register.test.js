import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { u82o } from 'performance-helpers/powerBuffer'

// vi.mock must be hoisted to the top level (Vitest 5 makes nested calls
// throw). These static mocks are file-scoped and active for every test.
vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))
vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s ?? '')}</p>`, setOptions: () => {} }, default: { parse: (s) => `<p>${String(s ?? '')}</p>`, setOptions: () => {} } }))
vi.mock('https://cdn.jsdelivr.net/npm/highlight.js/lib/core.js', () => ({ default: { registerLanguage: () => {}, getLanguage: () => false } }), { virtual: true })

function decodePosted(m) {
  if (m instanceof Uint8Array || (ArrayBuffer.isView && ArrayBuffer.isView(m))) {
    try { return u82o(m) } catch (_) {}
  }
  return m
}

describe('renderer worker register-success', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(decodePosted(m))
    vi.resetModules()
    // prepare a local language module file
    const langPath = path.resolve('tests/worker/_lang_test_module.mjs')
    fs.writeFileSync(langPath, 'export default function(){ return {} }', 'utf8')
    globalThis._langTestModule = langPath

    // create rewritten worker module (assign to globalThis.onmessage)
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
      let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
      rewritten = rewritten.replace("./rendererRuntime.js", "../../src/worker/rendererRuntime.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_reg.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    globalThis._rendererRegModule = tmpPath
  })
  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(globalThis._langTestModule) } catch(_) {}
    try { fs.unlinkSync(globalThis._rendererRegModule) } catch(_) {}
    // vi.unmock is intentionally omitted: the mocks are hoisted to the top
    // level and are file-scoped, so they are reset automatically when the
    // module registry is torn down. (In Vitest 5 vi.unmock is also hoistable,
    // so a nested call here would throw.)
  })

  it('register posts registered when language module loads and hljs core is available', async () => {
    // CDN core mock is hoisted to the top of the file (see line 11), so it is
    // already active here — no vi.mock call is needed inside the test body.
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
