import { describe, it, expect, beforeAll, vi } from 'vitest'
import { detectFenceLanguages, parseMarkdownToHtml, addMarkdownExtension, setMarkdownExtensions, markdownExtensions } from '../src/markdown.js'
import { registerLanguage, BAD_LANGUAGES } from '../src/codeblocksManager.js'
import { registerLanguage as regFromCms } from '../src/nimbi-cms.js'
import initCMS from '../src/nimbi-cms.js'

// helper to create a small "supported" map simulating fetched data
function makeMap(entries) {
  const m = new Map()
  for (const e of entries) m.set(e, e)
  return m
}

describe('markdown utilities', () => {
  it('does not fetch supported language list until a language registration happens', async () => {
    const fetchStub = vi.fn(() => Promise.resolve({ ok: true, text: () => Promise.resolve('') }))
    global.fetch = fetchStub
    // initial operation should not trigger a fetch
    detectFenceLanguages('```js\nfoo\n```', new Map())
    expect(fetchStub).not.toHaveBeenCalled()
    // registering a language should kick off the fetch
    await registerLanguage('javascript')
    expect(fetchStub).toHaveBeenCalled()
  })

  it('detects common fence languages including two-letter ones', () => {
    const md = []
      .concat(
        '\n',
        'date: 2020',
        '---',
        '',
        '```js',
        "console.log('hello')", 
        '```',
        '',
        '```python',
        "print('hi')", 
        '```',
        '',
        '```magic',
        'not really',
        '```',
        '',
        '```undefined',
        '? ? ?',
        '```'
      )
      .join('\n')
    const langs = detectFenceLanguages(md, makeMap(['javascript', 'python']))
    // 'js' should map to javascript via alias rule
    expect(langs.has('javascript') || langs.has('js')).toBe(true)
    expect(langs.has('python')).toBe(true)
    // banned items should not be present
    expect(langs.has('magic')).toBe(false)
    expect(langs.has('undefined')).toBe(false)
  })

  it('does not filter two-letter names when supportedMap is empty', () => {
    const md = ['```js','foo','```'].join('\n')
    const langs = detectFenceLanguages(md, new Map())
    expect(langs.has('js')).toBe(true)
  })

  it('filters by supportedMap when provided and populated', () => {
    const md = ['```rb','foo','```'].join('\n')
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

  describe('markdown extension plugins', () => {
    beforeEach(() => {
      // clear any leftover plugins before each test
      setMarkdownExtensions([])
    })

    it('can register an extension directly', async () => {
      const ext = {
        renderer: {
          paragraph() {
            return `<p>PLUGIN</p>`
          }
        }
      }
      addMarkdownExtension(ext)
      const result = await parseMarkdownToHtml('hello')
      // the paragraph renderer should replace entire paragraph with PLUGIN
      expect(result.html.trim()).toBe('<p>PLUGIN</p>')
    })

    it('honors extensions passed to initCMS', async () => {
      // plugin that uppercases headings
      const ext = {
        renderer: {
          heading() {
            return '<h1>UP</h1>'
          }
        }
      }
      // run initCMS with the extension; minimal DOM stub
      document.body.innerHTML = '<div id="app"></div>'
      global.fetch = vi.fn(async url => ({ ok: true, text: () => Promise.resolve('# home') }))
      await initCMS({ el: '#app', searchIndex: false, markdownExtensions: [ext] })
      const res = await parseMarkdownToHtml('# hi')
      expect(res.html).toContain('UP')
    })
  })
})
