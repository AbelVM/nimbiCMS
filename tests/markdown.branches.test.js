import { describe, it, expect, vi } from 'vitest'
import * as mdModule from '../src/markdown.js'

describe('markdown fence language detection branches', () => {
  it('detectFenceLanguages recognizes known fallback and unknown names', () => {
    const s = mdModule.detectFenceLanguages('```python\n```\n```mylang\n```\n```then\n```\n```magic\n```')
    // python (in FALLBACK_KNOWN) and mylang (custom long name) should be present
    expect(s.has('python')).toBe(true)
    expect(s.has('mylang')).toBe(true)
    // 'then' is in STOP and short, should not be present
    expect(s.has('then')).toBe(false)
    // BAD_LANGUAGES like 'magic' should be skipped
    expect(s.has('magic')).toBe(false)
  })

  it('detectFenceLanguages respects supportedMap and HLJS alias mapping', () => {
    const supported = new Map([['javascript', 'javascript']])
    const s = mdModule.detectFenceLanguages('```js\n```\n```JS\n```', supported)
    // 'js' should map to 'javascript' via HLJS_ALIAS_MAP and supportedMap
    expect(s.has('javascript')).toBe(true)
  })

  it('detectFenceLanguages accepts short names when in FALLBACK_KNOWN', () => {
    const s = mdModule.detectFenceLanguages('```sh\n```')
    expect(s.has('sh') || s.has('bash')).toBe(true)
  })

  it('detectFenceLanguagesAsync returns a Set and falls back deterministically in test env', async () => {
    const res = await mdModule.detectFenceLanguagesAsync('```mylang\n```')
    expect(res).toBeInstanceOf(Set)
    // fallback detection in test env should include mylang
    expect(res.has('mylang')).toBe(true)
  })
})
