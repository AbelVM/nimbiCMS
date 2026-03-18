import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../src/worker/renderer.js'

describe('worker renderer message handling', () => {
  it('register returns error when hljs unavailable', async () => {
    const res = await handleWorkerMessage({ type: 'register', name: 'x', url: 'https://example.com/lang.js' })
    expect(res).toBeTruthy()
    expect(res.type).toBe('register-error')
    expect(res.name).toBe('x')
    expect(typeof res.error).toBe('string')
  })

  it('render returns html, meta and decoded toc with unique ids and lazy images', async () => {
    const md = `---\ntitle: MyTitle\n---\n# Hello &amp; World\n\n![alt](/img.png)\n\n# Hello &amp; World\n`;
    const res = await handleWorkerMessage({ id: '1', md })
    expect(res).toBeTruthy()
    expect(res.id).toBe('1')
    expect(res.result).toBeTruthy()
    const { html, meta, toc } = res.result
    expect(meta && meta.title).toBe('MyTitle')
    // images should include loading lazy
    expect(html.includes('loading="lazy"')).toBe(true)
    // two headings with generated ids
    expect(html.includes('id="hello-world"')).toBe(true)
    expect(html.includes('id="hello-world-2"')).toBe(true)
    // toc entries should contain decoded text
    expect(Array.isArray(toc)).toBe(true)
    expect(toc.length).toBeGreaterThanOrEqual(2)
    expect(toc[0].text).toBe('Hello & World')
  })

  it('render respects existing id attributes and decodes entities in text', async () => {
    const md = '<h2 id="custom">Foo &amp; Bar</h2>'
    const res = await handleWorkerMessage({ id: '2', md })
    expect(res).toBeTruthy()
    expect(res.id).toBe('2')
    const { result } = res
    expect(result && result.toc && result.toc[0] && result.toc[0].id).toBe('custom')
    expect(result.toc[0].text).toBe('Foo & Bar')
  })
})
