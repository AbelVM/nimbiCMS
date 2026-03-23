import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

describe('renderer worker extra', () => {
  let posted = []
  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(m)
    vi.resetModules()
    vi.mock('../../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))
    // prepare a fake language module
    const langMod = `export default function(hljs) { return { name: 'fake' } }`;
    const langPath = path.resolve('tests/worker/_fake_lang.mjs')
    fs.writeFileSync(langPath, langMod, 'utf8')
    globalThis._fakeLangPath = pathToFileURL(langPath).href
    // create a modified copy of renderer.js with pre-seeded hljs and globalThis.onmessage
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace('let hljs = null', "let hljs = { registerLanguage: function(name, lang) { this[name]=lang }, getLanguage: function(n){ return !!this[n] }, highlight: function(c, o){ return c } }")
    rewritten = rewritten.replace(/(^|\n)onmessage\s*=/g, '$1globalThis.onmessage =')
    rewritten = rewritten.replace("../utils/frontmatter.js", "../../src/utils/frontmatter.js")
    rewritten = rewritten.replace("../utils/cache.js", "../../src/utils/cache.js")
    const tmpPath = path.resolve('tests/worker/_renderer_test_module_extra.mjs')
    fs.writeFileSync(tmpPath, rewritten, 'utf8')
    globalThis._rendererTestModuleExtra = tmpPath
  })

  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    try { fs.unlinkSync(path.resolve('tests/worker/_fake_lang.mjs')) } catch (_) {}
    try { fs.unlinkSync(globalThis._rendererTestModuleExtra) } catch (_) {}
    vi.unmock('../../src/utils/frontmatter.js')
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
