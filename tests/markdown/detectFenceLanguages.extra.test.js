import { describe, it, expect } from 'vitest'
import { detectFenceLanguages, detectFenceLanguagesAsync } from '../../src/markdown.js'

describe('detectFenceLanguages edge cases', () => {
  it('maps supported aliases and ignores stop-words', () => {
    const md = '```js\nconsole.log(1)\n```\n\n```then\nnope\n```'
    const supported = new Map([['js', 'javascript']])
    const res = detectFenceLanguages(md, supported)
    expect(res.has('javascript')).toBeTruthy()
    expect(res.has('then')).toBeFalsy()
  })

  it('async detection falls back to sync when worker not used', async () => {
    const md = '```python\nprint(1)\n```'
    const res = await detectFenceLanguagesAsync(md, new Map())
    expect(res.has('python')).toBeTruthy()
  })
})
