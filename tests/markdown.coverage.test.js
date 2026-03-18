import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import * as md from '../src/markdown.js'

describe('markdown detection coverage', () => {
  beforeEach(() => {
    // ensure clean env
    delete process.env.MY_TEST_FLAG
  })

  it('detectFenceLanguages finds simple known languages', () => {
    const s = 'Some text\n```js\nconsole.log(1)\n```\n```python\nprint(1)\n```\n```bash\necho hi\n```'
    const res = md.detectFenceLanguages(s)
    expect(res.has('js')).toBe(true)
    expect(res.has('python')).toBe(true)
    expect(res.has('bash')).toBe(true)
  })

  it('detectFenceLanguages respects supportedMap canonical mapping', () => {
    const s = '```js\n```'
    const map = new Map([['js', 'javascript']])
    const res = md.detectFenceLanguages(s, map)
    expect(res.has('javascript')).toBe(true)
    // original short name should not be present when canonical mapping exists
    expect(res.has('js')).toBe(false)
  })

  it('detectFenceLanguages ignores stop-words and accepts long valid names', () => {
    const s = '```then\n```\n```customlanguage123\n```'
    const res = md.detectFenceLanguages(s)
    expect(res.has('then')).toBe(false)
    expect(res.has('customlanguage123')).toBe(true)
  })

  it('detectFenceLanguagesAsync returns same result in VITEST env', async () => {
    const s = '```js\n```\n```customlanguage123\n```'
    const exp = md.detectFenceLanguages(s)
    const got = await md.detectFenceLanguagesAsync(s)
    expect(got).toEqual(exp)
  })
})
