import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../src/slugSearchRuntime.js', () => ({
  awaitSearchIndex: vi.fn(async () => {
    throw new Error('awaitSearchIndex should not be called for normal page loads when exposeSitemap is true')
  }),
}))

vi.mock('../src/runtimeSitemap.js', () => ({
  handleSitemapRequest: vi.fn(async () => false),
  exposeSitemapGlobals: vi.fn(async () => ({ deduped: [] })),
  clearSitemapWriteTimer: vi.fn(),
}))

import initCMS from '../src/nimbi-cms.js'
import { destroy } from '../src/init.js'
import * as slugSearchRuntime from '../src/slugSearchRuntime.js'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import { getWorkerPoolDiagnostics } from '../src/utils/workerPoolDiagnostics.js'

describe('initCMS exposeSitemap performance', () => {
  let origFetch
  let origLocation

  beforeEach(() => {
    origFetch = global.fetch
    document.body.innerHTML = '<div id="app"></div>'
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
    origLocation = global.location
    global.location = new URL('http://localhost:5544/#/nimbicms')
  })

  afterEach(() => {
    global.fetch = origFetch
    global.location = origLocation
    vi.clearAllMocks()
  })

  afterEach(async () => {
    await destroy()
  })

  it('does not await sitemap/index build for normal page loads when exposeSitemap is true', async () => {
    await expect(
      initCMS({ el: '#app', searchIndex: false, exposeSitemap: true }),
    ).resolves.toBeUndefined()
    expect(slugSearchRuntime.awaitSearchIndex).not.toHaveBeenCalled()
    expect(runtimeSitemap.handleSitemapRequest).not.toHaveBeenCalled()
    expect(runtimeSitemap.exposeSitemapGlobals).toHaveBeenCalled()
  })

  it('releases the mount and UI ownership across repeated lifecycles', async () => {
    for (let cycle = 0; cycle < 3; cycle += 1) {
      await initCMS({ el: '#app', searchIndex: false })
      expect(document.querySelector('.nimbi-mount .nimbi-cms')).toBeTruthy()
      expect(window.__nimbiUI).toBeTruthy()

      await destroy()
      expect(document.querySelector('.nimbi-mount .nimbi-cms')).toBeNull()
      expect(window.__nimbiUI).toBeNull()
      expect(getWorkerPoolDiagnostics()).toEqual({})
    }
    expect(runtimeSitemap.clearSitemapWriteTimer).toHaveBeenCalled()
  })
})
