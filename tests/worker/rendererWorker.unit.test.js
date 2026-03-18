import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('renderer worker unit tests', () => {
  it('returns register-error when hljs unavailable', async () => {
    const res = await handleWorkerMessage({ type: 'register', name: 'javascript', url: 'https://example.com/lang.js' })
    expect(res).toHaveProperty('type')
    expect(res.type).toBe('register-error')
    expect(res).toHaveProperty('error')
    expect(String(res.error).toLowerCase()).toMatch(/hljs unavailable|cannot/i)
  })

  it('renders markdown and returns html, toc and meta', async () => {
    const md = ['---', 'title: Foo', '---', '', '# My Heading', '', 'Some text', '', '![alt](/path/to/img.png)'].join('\n')
    const res = await handleWorkerMessage({ id: 'x1', md })
    expect(res).toHaveProperty('id', 'x1')
    expect(res).toHaveProperty('result')
    const { html, meta, toc } = res.result
    expect(typeof html).toBe('string')
    expect(html).toMatch(/<h1[^>]*>My Heading<\/h1>/)
    expect(toc).toBeInstanceOf(Array)
    expect(toc.find(h => h.text && h.text.includes('My Heading'))).toBeTruthy()
    expect(meta).toHaveProperty('title', 'Foo')
  })

  it('adds loading="lazy" to images without loading or data-want-lazy', async () => {
    const md = '# Heading\n\n![](/img/lazy.png)'
    const res = await handleWorkerMessage({ id: 'img1', md })
    const { html } = res.result
    expect(html).toMatch(/<img[^>]+loading=("|')lazy("|')/)
  })
})
