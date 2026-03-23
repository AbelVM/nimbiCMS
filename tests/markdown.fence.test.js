import { describe, it, expect } from 'vitest'
import { detectFenceLanguages, detectFenceLanguagesAsync } from '../src/markdown.js'

describe('markdown fence language detection', () => {
  it('detects known and custom fence languages and skips bad ones', () => {
    const md = "```javascript\nconsole.log('x')\n```\n```magic\nnope\n```\n```customlang\ncode\n```"
    const set = detectFenceLanguages(md)
    expect(set.has('javascript')).toBe(true)
    expect(set.has('magic')).toBe(false)
    expect(set.has('customlang')).toBe(true)
  })

  it('uses supportedMap to canonicalize short aliases', () => {
    const supported = new Map([['js', 'javascript']])
    const set = detectFenceLanguages('```js\nx\n```', supported)
    expect(set.has('javascript')).toBe(true)
  })

  it('detectFenceLanguagesAsync falls back under test env', async () => {
    const set = await detectFenceLanguagesAsync('```python\nprint(1)\n```')
    expect(set.has('python')).toBe(true)
  })
})
