import { describe, it, expect } from 'vitest'

import { detectFenceLanguages, detectFenceLanguagesAsync } from '../src/markdown.js'

describe('detectFenceLanguages', () => {
  it('detects common languages and excludes BAD_LANGUAGES', () => {
    const md = 'Here is code\n```js\nconsole.log("hi")\n```\n\nAnd magic:\n```magic\noops\n```\n\nAlso customlang:\n```mycustomlang\nx\n```'
    const res = detectFenceLanguages(md)
    expect(res.has('js')).toBe(true)
    expect(res.has('magic')).toBe(false)
    expect(res.has('mycustomlang')).toBe(true)
  })

  it('uses supportedMap to map aliases and include short names', () => {
    const md = '```py\nprint(1)\n```\n```js\n1+1\n```'
    const map = new Map([['py', 'python'], ['js', 'javascript']])
    const res = detectFenceLanguages(md, map)
    expect(res.has('python')).toBe(true)
    expect(res.has('javascript')).toBe(true)
  })

  it('ignores names in STOP and respects fallback known set', () => {
    const md = "```then\nfoo\n```\n```rust\nfn main(){}\n```"
    const res = detectFenceLanguages(md)
    expect(res.has('then')).toBe(false)
    expect(res.has('rust')).toBe(true)
  })
})

describe('detectFenceLanguagesAsync', () => {
  it('falls back to sync detection in test env', async () => {
    const md = "```js\n1+1\n```\n```unknownlang\nhi\n```"
    const res = await detectFenceLanguagesAsync(md)
    expect(res.has('js')).toBe(true)
    expect(res.has('unknownlang')).toBe(true)
  })
})
