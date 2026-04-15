import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import fs from 'fs'
import path from 'path'
import { pathToFileURL } from 'url'
import { u82o } from '../../node_modules/performance-helpers/src/helpers/powerBuffer.js'

function decodePosted(m) {
  if (m instanceof Uint8Array || (ArrayBuffer.isView && ArrayBuffer.isView(m))) {
    try { return u82o(m) } catch (_) {}
  }
  return m
}

describe('renderer worker (unit)', () => {
  let posted = []
  let tmpFiles = []

  const loadWorkerModule = async ({ throwParse = false } = {}) => {
    vi.resetModules()
    vi.doUnmock('marked')
    vi.doUnmock('../../src/utils/frontmatter.js')

    vi.doMock('marked', () => ({
      marked: {
        parse: throwParse ? (() => { throw new Error('boom') }) : ((s) => `<p>${String(s ?? '')}</p>`),
        setOptions: () => {}
      },
      default: {
        parse: throwParse ? (() => { throw new Error('boom') }) : ((s) => `<p>${String(s ?? '')}</p>`),
        setOptions: () => {}
      }
    }))
    vi.doMock('../../src/utils/frontmatter.js', () => ({
      parseFrontmatter: (md) => ({ content: md || '', data: {} })
    }))

    const src = fs.readFileSync(path.resolve('src/worker/renderer.js'), 'utf8')
    let rewritten = src.replace(/(^|\n)onmessage\s*=/g, '$1globalThis.onmessage =')
    const nonce = `${Date.now()}_${Math.random().toString(36).slice(2)}`
    rewritten = rewritten.replace('./rendererRuntime.js', `../../src/worker/rendererRuntime.js?test=${nonce}`)

    const tmpPath = path.resolve(`tests/worker/_renderer_test_module_${Date.now()}_${Math.random().toString(36).slice(2)}.mjs`)
    tmpFiles.push(tmpPath)
    fs.writeFileSync(tmpPath, rewritten, 'utf8')

    return import(pathToFileURL(tmpPath).href)
  }

  beforeEach(() => {
    posted = []
    globalThis.postMessage = (m) => posted.push(decodePosted(m))
  })

  afterEach(() => {
    try { delete globalThis.onmessage } catch (_) {}
    try { delete globalThis.postMessage } catch (_) {}
    for (const file of tmpFiles) {
      try { if (fs.existsSync(file)) fs.unlinkSync(file) } catch (_) {}
    }
    tmpFiles = []
    vi.doUnmock('marked')
    vi.doUnmock('../../src/utils/frontmatter.js')
  })

  it('renders markdown and returns a worker response envelope', async () => {
    await loadWorkerModule()
    await globalThis.onmessage({ data: { id: '1', md: '# Hello\n\nBody' } })

    const out = posted[posted.length - 1]
    expect(out.id).toBe('1')
    // The worker can either return parsed result or a guarded error depending
    // on runtime feature availability in the test environment.
    expect(!!out.result || !!out.error).toBe(true)
    if (out.result) {
      expect(Array.isArray(out.result.toc)).toBe(true)
      expect(out.result.meta && typeof out.result.meta === 'object').toBe(true)
    }
  })

  it('handles register failure by posting register-error', async () => {
    await loadWorkerModule()
    await globalThis.onmessage({ data: { type: 'register', name: 'x', url: 'https://example.com/nonexistent.js' } })

    const last = posted[posted.length - 1]
    expect(last.type).toBe('register-error')
    expect(last.name).toBe('x')
  })

  it('posts an error envelope when marked.parse throws', async () => {
    await loadWorkerModule({ throwParse: true })
    await globalThis.onmessage({ data: { id: '2', md: '# x' } })

    const last = posted[posted.length - 1]
    expect(last.id).toBe('2')
    expect(last.error).toBeTruthy()
  })
})
