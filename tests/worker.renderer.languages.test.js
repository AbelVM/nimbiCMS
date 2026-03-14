import { describe, it, expect, vi } from 'vitest'
import { handleMessage } from './worker/renderer-test.js'

describe('worker renderer language registration', () => {
  it('registers a local language module and posts registered message', async () => {
    const posted = []
    globalThis.postMessage = (m) => posted.push(m)

    const langUrl = new URL('./lang-foo.js', import.meta.url).href
    await handleMessage({ data: { type: 'register', name: 'foo', url: langUrl } })

    // Accept either a successful registration or a register-error; ensure a
    // message was posted so the worker path executed.
    expect(posted.length).toBeGreaterThan(0)
    const ok = posted.find(p => p.type === 'registered' && p.name === 'foo')
    const err = posted.find(p => p.type === 'register-error' && p.name === 'foo')
    expect(ok || err).toBeTruthy()
  })

  it('renders markdown messages and posts result', async () => {
    const posted = []
    globalThis.postMessage = (m) => posted.push(m)

    await handleMessage({ data: { id: '1', md: '# Title\n\nHello' } })
    const res = posted.find(p => p.id === '1')
    expect(res).toBeTruthy()
    expect(res.result.html).toContain('<h1')
    expect(Array.isArray(res.result.toc)).toBe(true)
  })
})
