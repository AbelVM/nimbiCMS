import { describe, it, expect, beforeEach, vi } from 'vitest'
import * as cb from '../src/codeblocksManager.js'

describe('codeblocksManager alias and fallback', () => {
  beforeEach(() => {
    cb.SUPPORTED_HLJS_MAP.clear()
    // ensure hljs exists
    cb.hljs.registerLanguage = cb.hljs.registerLanguage || function () {}
  })

  it('registers alias `js` when supported list contains `javascript`', async () => {
    cb.SUPPORTED_HLJS_MAP.set('javascript', 'javascript')
    const ok = await cb.registerLanguage('js')
    expect(ok).toBe(true)
    // second call should be short-circuited
    const ok2 = await cb.registerLanguage('js')
    expect(ok2).toBe(true)
  })

  it('returns false for unknown language names', async () => {
    const res = await cb.registerLanguage('thisdoesnotexist')
    expect(res).toBe(false)
    const res2 = await cb.registerLanguage('thisdoesnotexist')
    expect(res2).toBe(false)
  })
})
