import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { u82o } from 'performance-helpers/powerBuffer'

// vi.mock must be hoisted to the top level (Vitest 5 makes nested calls
// throw). The factory is static, so it is safe to keep active for the whole
// file.
vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))

function decodePosted(m) {
  if (m instanceof Uint8Array || (ArrayBuffer.isView && ArrayBuffer.isView(m))) {
    try { return u82o(m) } catch (_) {}
  }
  return m
}

describe('renderer worker extra', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(decodePosted(m))
    vi.resetModules()
    // prepare a fake language module
    const langMod = `export default function(hljs) { return { name: 'fake' } }`;
    const langPath = path.resolve('tests/worker/_fake_lang.mjs')
    fs.writeFileSync(langPath, langMod, 'utf8')
    globalThis._fakeLangPath = pathToFileURL(langPath).href
    // create a modified copy of renderer.js with pre-seeded hljs and globalThis.onmessage
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace('from "./rendererRuntime.js"', 'from "../../src/worker/rendererRuntime.js"')
    rewritten = rewritten.replace(/(^|\n)onmessage\s*=/g, '$1globalThis.onmessage =')
    let tryMock = rewritten.replace('let hljs = null', "let hljs = { registerLanguage: function(name, lang) { this[name]=lang }, getLanguage: function(n){ return !!this[n] }, highlight: function(c, o){ return c } }")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_extra.mjs')
    fs.writeFileSync(tmpPath, tryMock, 'utf8')
    globalThis._rendererTestModuleExtra = tmpPath
  })

  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(path.resolve('tests/worker/_fake_lang.mjs')) } catch (_) {}
    try { fs.unlinkSync(globalThis._rendererTestModuleExtra) } catch (_) {}
    // vi.unmock is intentionally omitted: the mock is hoisted to the top
    // level and is file-scoped, so it is reset automatically when the module
    // registry is torn down. (In Vitest 5 vi.unmock is also hoistable, so a
    // nested call here would throw.)
  })

  it('register success posts registered when hljs available', async () => {
    const tmpPath = globalThis._rendererTestModuleExtra
    const mod = await import(pathToFileURL(tmpPath).href)
    await globalThis.onmessage({ data: { type: 'register', name: 'fake', url: globalThis._fakeLangPath } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('registered')
    expect(last.name).toBe('fake')
  })
})
