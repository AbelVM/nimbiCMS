import { describe, it, expect, beforeAll } from 'vitest'
import { detectFenceLanguages } from '../src/markdown.js'
import { registerLanguage, BAD_LANGUAGES } from '../src/codeblocksManager.js'
import { registerLanguage as regFromCms } from '../src/nimbi-cms.js'

// helper to create a small "supported" map simulating fetched data
function makeMap(entries) {
  const m = new Map()
  for (const e of entries) m.set(e, e)
  return m
}

describe('markdown utilities', () => {
  it('detects common fence languages including two-letter ones', () => {
    const md = `

date: 2020
---

```js
console.log('hello')
```

```python
print('hi')
```

```magic
not really
```

```undefined
? ? ?
```
`;
    const langs = detectFenceLanguages(md, makeMap(['javascript', 'python']))
    // 'js' should map to javascript via alias rule
    expect(langs.has('javascript') || langs.has('js')).toBe(true)
    expect(langs.has('python')).toBe(true)
    // banned items should not be present
    expect(langs.has('magic')).toBe(false)
    expect(langs.has('undefined')).toBe(false)
  })

  it('does not filter two-letter names when supportedMap is empty', () => {
    const md = '```js\nfoo\n```'
    const langs = detectFenceLanguages(md, new Map())
    expect(langs.has('js')).toBe(true)
  })

  it('filters by supportedMap when provided and populated', () => {
    const md = '```rb\nfoo\n```'
    const langs = detectFenceLanguages(md, makeMap(['ruby']))
    // 'rb' is not in map so should be skipped
    expect(langs.size).toBe(0)
  })

  it('registerLanguage returns false for banned languages', async () => {
    const ok = await registerLanguage('magic')
    expect(ok).toBe(false)
    // also validate the re-export from the main module
    const ok2 = await regFromCms('magic')
    expect(ok2).toBe(false)
  })

  it('registerLanguage can register a real language', async () => {
    const ok = await registerLanguage('javascript')
    expect(ok).toBe(true)
    const ok2 = await regFromCms('javascript')
    expect(ok2).toBe(true)
  })
})
