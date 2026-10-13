import { describe, it, expect } from 'vitest'
import { buildTocElement, prepareArticle, renderNotFound, executeEmbeddedScripts } from '../src/htmlBuilder.js'

describe('htmlBuilder additional branches', () => {
  it('buildTocElement returns null for a single item', () => {
    const t = k => k
    const toc = [{ level: 2, text: 'Only' }]
    const res = buildTocElement(t, toc, '')
    expect(res).toBeNull()
  })

  it('buildTocElement builds nested TOC when appropriate', () => {
    const t = k => k
    const toc = [
      { level: 2, text: 'A' },
      { level: 3, text: 'B' },
      { level: 4, text: 'C' },
      { level: 2, text: 'D' }
    ]
    const res = buildTocElement(t, toc, 'path/file.md')
    expect(res).toBeTruthy()
    expect(res.querySelectorAll('li').length).toBeGreaterThan(1)
    expect(res.querySelector('ul ul')).toBeTruthy()
  })

  it('prepareArticle rewrites relative image src and marks for lazy loading', async () => {
    const t = k => k
    const raw = '<h1>Title</h1><p><img src="img.png"></p>'
    const data = { raw, isHtml: true }
    const { article } = await prepareArticle(t, data, 'dir/page.md', null, 'http://example.com/base/')
    const img = article.querySelector('img')
    expect(img).toBeTruthy()
    expect(img.src).toContain('/base/dir/img.png')
    expect(img.getAttribute('data-want-lazy') || img.getAttribute('loading')).toBeTruthy()
  })

  it('renderNotFound inserts not-found markup into container', () => {
    const container = document.createElement('div')
    const t = k => ({ notFound: 'Not found', home: 'Home', goHome: 'Go home' }[k])
    renderNotFound(container, t, new Error('boom'))
    const nf = container.querySelector('.nimbi-not-found')
    expect(nf).toBeTruthy()
    expect(nf.textContent).toContain('Not found')
  })

  it('executeEmbeddedScripts runs inline scripts and removes the element', () => {
    const article = document.createElement('article')
    const s = document.createElement('script')
    s.textContent = 'window.__testInlineExecuted = 123'
    article.appendChild(s)
    executeEmbeddedScripts(article, true, ['https://example.com'])
    expect(window.__testInlineExecuted).toBe(123)
    expect(article.querySelector('script')).toBeNull()
    delete window.__testInlineExecuted
  })

  it('executeEmbeddedScripts strips scripts when allowEmbeddedScripts is false', () => {
    const article = document.createElement('article')
    const inlineScript = document.createElement('script')
    inlineScript.textContent = 'window.__testShouldNotRun = 1'
    article.appendChild(inlineScript)
    const externalScript = document.createElement('script')
    externalScript.src = 'https://example.com/x.js'
    article.appendChild(externalScript)
    executeEmbeddedScripts(article, false)
    expect(window.__testShouldNotRun).toBeUndefined()
    expect(article.querySelector('script')).toBeNull()
  })

  it('blocks non-same-origin external scripts without an allowlist entry', () => {
    const article = document.createElement('article')
    const script = document.createElement('script')
    script.src = 'https://example.com/x.js'
    article.appendChild(script)

    executeEmbeddedScripts(article, true)

    expect(article.querySelector('script')).toBeNull()
    expect(document.querySelector('script[src="https://example.com/x.js"]')).toBeNull()
  })

  it('executeEmbeddedScripts preserves nonce attribute when allowEmbeddedScripts is true', () => {
    const article = document.createElement('article')
    const s = document.createElement('script')
    s.setAttribute('nonce', 'abc123')
    s.textContent = 'window.__testNoncePreserved = true'
    article.appendChild(s)
    executeEmbeddedScripts(article, true)
    expect(window.__testNoncePreserved).toBe(true)
    const remaining = article.querySelector('script')
    expect(remaining).toBeNull()
    const injected = document.querySelector('script[nonce="abc123"]')
    expect(injected).toBeTruthy()
    injected?.remove()
    delete window.__testNoncePreserved
  })
})
