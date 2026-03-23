import { test, expect } from 'vitest'
import { setMarkdownExtensions, addMarkdownExtension, parseMarkdownToHtml } from '../src/markdown.js'

test('parseMarkdownToHtml: headings, img lazy-loading, and code class cleaning', async () => {
  // Ensure a clean plugin list then add a no-op plugin to force the
  // DOM-parsing branch inside parseMarkdownToHtml.
  setMarkdownExtensions([])
  addMarkdownExtension({})

  const md = `---\ntitle: Test\n---\n# Heading One\n\n## Heading Two\n\n![alt](img.png)\n\n<pre><code class="language-undefined">console.log('x')</code></pre>`

  const res = await parseMarkdownToHtml(md)
  expect(res).toBeTruthy()
  // TOC should include both headings (levels 1 and 2)
  const levels = res.toc.map(t => t.level)
  expect(levels).toContain(1)
  expect(levels).toContain(2)
  // HTML should contain an img with loading="lazy"
  expect(res.html).toMatch(/<img[^>]*loading="lazy"/)
  // Code class 'language-undefined' should be removed
  expect(res.html).not.toMatch(/language-undefined/)

  // cleanup
  setMarkdownExtensions([])
})
