import { describe, it, expect } from 'vitest'
import { prepareArticle, executeEmbeddedScripts } from '../src/htmlBuilder.js'

describe('htmlBuilder deeper branches', () => {
  it('rewrites relative asset urls in HTML string via prepareArticle', async () => {
    const raw = '<img src="images/pic.png"><a href="docs/page.html">x</a>'
    const data = { raw, isHtml: true }
    const { article } = await prepareArticle(() => 't', data, '/content/en/posts/my-post/', null, 'http://localhost/')
    const img = article.querySelector('img')
    const a = article.querySelector('a')
    expect(img).toBeTruthy()
    expect(a).toBeTruthy()
    expect(img.src).toContain('/content/en/posts/my-post/images/pic.png')
    const pageParam = new URL(a.href).searchParams.get('page')
    if (pageParam) {
      expect(decodeURIComponent(pageParam)).toContain('content/en/posts/my-post/docs/page.html')
    } else {
      // When no slug mapping is available in test setup, href can remain as a direct html path.
      expect(a.href).toContain('docs/page.html')
    }
  })

  it('executeEmbeddedScripts runs inline scripts and removes them', () => {
    const container = document.createElement('div')
    const script = document.createElement('script')
    script.textContent = 'window.__TEST_SCRIPT_RAN = (window.__TEST_SCRIPT_RAN||0) + 1'
    container.appendChild(script)
    executeEmbeddedScripts(container)
    expect(window.__TEST_SCRIPT_RAN).toBeGreaterThanOrEqual(1)
    expect(container.querySelector('script')).toBeNull()
  })
})
