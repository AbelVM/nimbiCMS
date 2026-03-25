import { describe, it, expect, vi } from 'vitest'
import { handleWorkerMessageStream, clearRendererImportCache } from '../../src/worker/renderer.js'

describe('renderer image attribute handling (stream)', () => {
  beforeEach(() => { clearRendererImportCache(); vi.resetAllMocks() })

  it('adds loading="lazy" to streamed chunks when missing', async () => {
    const md = '![alt](a.png)'
    const chunks = []
    const res = await handleWorkerMessageStream({ type: 'stream', id: 's1', md }, (c) => chunks.push(c))
    expect(res).toHaveProperty('type', 'done')
    const chunk = chunks.find(c => c.type === 'chunk')
    expect(chunk).toBeTruthy()
    expect(chunk.html.includes('loading="lazy"')).toBe(true)
  })

  it('preserves existing loading attr in stream chunks', async () => {
    const md = '<img src="a.png" loading="eager">'
    const chunks = []
    const res = await handleWorkerMessageStream({ type: 'stream', id: 's2', md }, (c) => chunks.push(c))
    expect(res).toHaveProperty('type', 'done')
    const chunk = chunks.find(c => c.type === 'chunk')
    expect(chunk.html.includes('loading="eager"')).toBe(true)
  })

  it('preserves data-want-lazy attribute in stream chunks', async () => {
    const md = '<img src="a.png" data-want-lazy="true">'
    const chunks = []
    const res = await handleWorkerMessageStream({ type: 'stream', id: 's3', md }, (c) => chunks.push(c))
    expect(res).toHaveProperty('type', 'done')
    const chunk = chunks.find(c => c.type === 'chunk')
    expect(chunk.html.includes('data-want-lazy="true"')).toBe(true)
    expect(chunk.html.includes('loading="lazy"')).toBe(false)
  })
})
