import { describe, it, expect } from 'vitest'
import { rewriteAnchors } from '../src/htmlBuilder.js'
import { storeSlugMapping } from '../src/slugManager.js'
import { JSDOM } from 'jsdom'

describe('repro href rewrite', () => {
  it('rewrites relative md links when pagePath is an actual file path', async () => {
    const dom = new JSDOM('<!doctype html><body><article><a href="bulmaManager/README.md">bulmaManager</a></article></body>')
    const article = dom.window.document.querySelector('article')
    storeSlugMapping('bulma-manager', 'docs/bulmaManager/README.md')
    await rewriteAnchors(article, 'http://localhost/docs/', 'docs/current/README.md')
    expect(article.querySelector('a').getAttribute('href')).toContain('?page=bulma-manager')
  })

  it('rewrites relative md links when pagePath is a slug', async () => {
    const dom = new JSDOM('<!doctype html><body><article><a href="bulmaManager/README.md">bulmaManager</a></article></body>')
    const article = dom.window.document.querySelector('article')
    storeSlugMapping('bulma-manager', 'docs/bulmaManager/README.md')
    await rewriteAnchors(article, 'http://localhost/', 'nimbi-cms')
    expect(article.querySelector('a').getAttribute('href')).toContain('?page=bulma-manager')
  })

  it('rewrites relative md links when pagePath is actual docs path', async () => {
    const dom = new JSDOM('<!doctype html><body><article><a href="bulmaManager/README.md">bulmaManager</a></article></body>')
    const article = dom.window.document.querySelector('article')
    storeSlugMapping('bulma-manager', 'docs/bulmaManager/README.md')
    await rewriteAnchors(article, 'http://localhost/', 'docs/README.md')
    expect(article.querySelector('a').getAttribute('href')).toContain('?page=bulma-manager')
  })
})
