import { describe, it, expect, afterEach } from 'vitest'
import { setMarkdownExtensions, parseMarkdownToHtml } from '../../src/markdown.js'

describe('parseMarkdownToHtml plugin+DOM path', () => {
  afterEach(() => {
    try { setMarkdownExtensions([]) } catch (_) {}
  })

  it('adds loading=lazy to imgs and removes language-undefined class', async () => {
    // ensure we take the plugin branch
    setMarkdownExtensions([{}])
    const md = `# Title

![alt](/img.png)

<pre><code class="language-undefined">console.log('x')</code></pre>`
    const res = await parseMarkdownToHtml(md)
    expect(res && typeof res.html === 'string').toBeTruthy()
    expect(res.html).toContain('loading="lazy"')
    expect(res.html).not.toContain('language-undefined')
    expect(Array.isArray(res.toc)).toBeTruthy()
    expect(res.toc.length).toBeGreaterThan(0)
  })
})
