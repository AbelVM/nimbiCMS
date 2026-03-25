import { describe, it, expect, vi } from 'vitest'

import { handleWorkerMessage, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer image attribute handling (non-stream)', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('adds loading="lazy" when missing', async () => {
    const md = '![alt](a.png)'
    const res = await handleWorkerMessage({ id: '1', md })
    expect(res).toHaveProperty('result')
    const html = res.result.html
    expect(html.includes('loading="lazy"')).toBe(true)
  })

  it('preserves existing loading attribute', async () => {
    const md = '<img src="a.png" loading="eager">'
    const res = await handleWorkerMessage({ id: '2', md })
    expect(res).toHaveProperty('result')
    const html = res.result.html
    // should keep loading attribute as provided
    expect(html.includes('loading="eager"')).toBe(true)
  })

  it('preserves data-want-lazy attribute', async () => {
    const md = '<img src="a.png" data-want-lazy="true">'
    const res = await handleWorkerMessage({ id: '3', md })
    expect(res).toHaveProperty('result')
    const html = res.result.html
    expect(html.includes('data-want-lazy="true"')).toBe(true)
    expect(html.includes('loading="lazy"')).toBe(false)
  })
})
