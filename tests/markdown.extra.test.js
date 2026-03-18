import { describe, it, expect } from 'vitest'
import { parseMarkdownToHtml, setMarkdownExtensions, detectFenceLanguages, detectFenceLanguagesAsync } from '../src/markdown.js'

describe('markdown module extra tests', () => {
  it('replaces emoji shortcodes using the emojimap during parse', async () => {
    // ensure we take the markdownPlugins branch
    setMarkdownExtensions([{}])
    const md = 'Hello :smile: world'
    const res = await parseMarkdownToHtml(md)
    expect(res).toBeTruthy()
    expect(res.html).toContain('😄')
  })

  it('detectFenceLanguages finds explicit fenced languages', () => {
    const md = '```javascript\nconsole.log("x")\n```'
    const set = detectFenceLanguages(md)
    expect(set.has('javascript')).toBe(true)
  })

  it('detectFenceLanguages maps short aliases via supportedMap', () => {
    const md = '```js\nconsole.log(1)\n```'
    const supported = new Map([['js', 'javascript']])
    const set = detectFenceLanguages(md, supported)
    expect(set.has('javascript')).toBe(true)
  })

  it('detectFenceLanguagesAsync falls back to sync detection in Vitest', async () => {
    const md = '```python\nprint(1)\n```'
    const res = await detectFenceLanguagesAsync(md)
    expect(res.has('python')).toBe(true)
  })
})
