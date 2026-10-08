import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'

const rendererFailMockState = vi.hoisted(() => ({ noCore: false }))

vi.mock('highlight.js/lib/core', () => {
  if (rendererFailMockState.noCore) return { default: null }
  return {
    default: {
      registerLanguage: () => {},
      getLanguage: () => false,
      highlight: (code) => ({ value: String(code) })
    }
  }
})

// vi.mock must be hoisted to the top level (Vitest 5 makes nested calls
// throw). These static mocks are file-scoped and active for every test.
vi.mock('marked', () => ({ marked: { parse: (s) => `<p>${String(s ?? '')}</p>` , setOptions: () => {} }, default: { parse: (s) => `<p>${String(s ?? '')}</p>` , setOptions: () => {} } }))
vi.mock('../src/utils/frontmatter.js', () => ({ parseFrontmatter: (md) => ({ content: md || '', data: {} }) }))

function decodePosted(m) {
  return m
}

describe('renderer worker register failure when hljs core missing', () => {
  let posted = []
beforeEach(() => {
    posted = []
    rendererFailMockState.noCore = false
    globalThis.postMessage = (m) => posted.push(decodePosted(m))
    vi.resetModules()
    // create a local language module that would succeed if hljs present
    const langPath = path.resolve('tests/_lang_ok.mjs')
    fs.writeFileSync(langPath, 'export default function(){ return {} }', 'utf8')
    globalThis._langOk = langPath

    // rewrite worker module to assign globalThis.onmessage
    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace(/(^|\n)onmessage\s*=\s*/g, '$1globalThis.onmessage = ')
    rewritten = rewritten.replace("./rendererRuntime.js", "../src/worker/rendererRuntime.js")
    const tmp = path.resolve('tests/_renderer_test_fail.mjs')
    fs.writeFileSync(tmp, rewritten, 'utf8')
    globalThis._rendererFail = tmp

  })
  afterEach(() => {
    try { fs.unlinkSync(globalThis._langOk) } catch (_) {}
    try { fs.unlinkSync(globalThis._rendererFail) } catch (_) {}
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    // vi.unmock is intentionally omitted: the mocks are hoisted to the top
    // level and are file-scoped, so they are reset automatically when the
    // module registry is torn down. (In Vitest 5 vi.unmock is also hoistable,
    // so a nested call here would throw.)
  })

  it('posts register-error when hljs core is unavailable even if language module exists', async () => {
    rendererFailMockState.noCore = true
    await import(pathToFileURL(globalThis._rendererFail).href)
    const langUrl = pathToFileURL(globalThis._langOk).href
    await globalThis.onmessage({ data: { type: 'register', name: 'xlang', url: langUrl } })
    const last = posted[posted.length - 1]
    expect(last.type).toBe('register-error')
    expect(last.name).toBe('xlang')
  })
})
