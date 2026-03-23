import { describe, it, expect, vi } from 'vitest'

import { detectFenceLanguages } from '../src/markdown.js'

describe('markdown.detectFenceLanguages', () => {
  it('recognizes common and fallback languages and ignores bad ones', () => {
    const md = [
      '```javascript\nconsole.log(1)\n```',
      '```magic\nnope\n```',
      '```superlang\ncode\n```'
    ].join('\n')
    const supported = new Map([['javascript', 'javascript']])
    const out = detectFenceLanguages(md, supported)
    expect(out.has('javascript')).toBe(true)
    expect(out.has('magic')).toBe(false)
    expect(out.has('superlang')).toBe(true)
  })

  it('falls back to renderer worker when VITEST env is removed', async () => {
    const mdModule = await import('../src/markdown.js')
    const old = process.env.VITEST
    try {
      // simulate non-Vitest env to force worker path
      delete process.env.VITEST
      const initSpy = vi.spyOn(mdModule, 'initRendererWorker').mockReturnValue({})
      const sendSpy = vi.spyOn(mdModule, '_sendToRenderer').mockResolvedValue(['py'])
      const res = await mdModule.detectFenceLanguagesAsync('```py\n```', new Map())
      expect(res.has('py')).toBe(true)
      initSpy.mockRestore()
      sendSpy.mockRestore()
    } finally {
      if (old !== undefined) process.env.VITEST = old
      else delete process.env.VITEST
    }
  })
})
