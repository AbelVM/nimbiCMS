import { describe, it, expect, vi } from 'vitest'
import * as md from '../src/markdown.js'

describe('markdown worker-detect branch', () => {
  it('detectFenceLanguagesAsync uses renderer worker when available', async () => {
    // Temporarily clear VITEST flag so worker-path is attempted
    const old = process.env.VITEST
    try {
      delete process.env.VITEST
      // Force no worker available so we exercise the fallback path deterministically
      vi.spyOn(md, 'initRendererWorker').mockReturnValue(null)
      const res = await md.detectFenceLanguagesAsync('```js\nconsole.log(1)\n```', new Map([['javascript','javascript'],['python','python']]))
      expect(res instanceof Set).toBe(true)
      expect(res.has('javascript')).toBe(true)
    } finally {
      if (old !== undefined) process.env.VITEST = old
    }
  })
})
