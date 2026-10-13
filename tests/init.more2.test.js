import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'
import { destroy } from '../src/init.js'
import { getCspNonce } from '../src/utils/helpers.js'

describe('initCMS additional sanitization branches', () => {
  let origFetch

  beforeEach(() => {
    origFetch = global.fetch
    document.body.innerHTML = '<div id="app"></div>'
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
  })

  afterEach(() => {
    global.fetch = origFetch
    vi.restoreAllMocks()
  })

  it('accepts explicit current-dir contentPath (./)', async () => {
    await expect(initCMS({ el: '#app', searchIndex: false, contentPath: './' })).resolves.toBeUndefined()
  })

  it('rejects windows-absolute contentPath', async () => {
    await expect(initCMS({ el: '#app', searchIndex: false, contentPath: 'C:\\tmp\\content' })).rejects.toThrow(TypeError)
  })

  it('rejects unsafe navigationPage with parent traversal', async () => {
    await expect(initCMS({ el: '#app', searchIndex: false, navigationPage: '../_navigation.md' })).rejects.toThrow(TypeError)
  })

  it('clears a previous runtime CSP nonce when omitted', async () => {
    await initCMS({ el: '#app', searchIndex: false, cspNonce: 'runtime-a' })
    expect(getCspNonce()).toBe('runtime-a')
    await destroy()

    document.body.innerHTML = '<div id="app"></div>'
    await initCMS({ el: '#app', searchIndex: false })
    expect(getCspNonce()).toBeNull()
    await destroy()
  })
})
