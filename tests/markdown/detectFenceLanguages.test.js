import { describe, it, expect } from 'vitest'
import { detectFenceLanguages, detectFenceLanguagesAsync } from '../../src/markdown.js'

describe('detectFenceLanguages', () => {
  it('detects known fallback languages like javascript', () => {
    const s = '```javascript\nconsole.log(1)\n```'
    const set = detectFenceLanguages(s)
    expect(set.has('javascript')).toBe(true)
  })

  it('ignores BAD_LANGUAGES like magic', () => {
    const s = '```magic\nx\n```'
    const set = detectFenceLanguages(s)
    expect(set.has('magic')).toBe(false)
  })

  it('maps supportedMap aliases to canonical names', () => {
    const s = '```js\n1\n```'
    const map = new Map([['js', 'javascript']])
    const set = detectFenceLanguages(s, map)
    expect(set.has('javascript')).toBe(true)
  })

  it('detectFenceLanguagesAsync resolves to the same set in Vitest', async () => {
    const s = '```python\n1\n```'
    const set = await detectFenceLanguagesAsync(s)
    expect(set.has('python')).toBe(true)
  })
})
