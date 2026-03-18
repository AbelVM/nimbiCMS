import { test, expect } from 'vitest'
import { buildTocElement, createNavTree, prepareArticle } from '../src/htmlBuilder.js'

test('buildTocElement returns null for single or no items', () => {
  const res = buildTocElement((k) => k, [{ level: 1, text: 'Top' }])
  expect(res).toBeNull()
  const res2 = buildTocElement((k) => k, [])
  expect(res2).toBeNull()
})

test('buildTocElement produces nested lists for levels >=2', () => {
  const toc = [
    { level: 2, text: 'Section A' },
    { level: 3, text: 'Sub A1' },
    { level: 2, text: 'Section B' },
    { level: 4, text: 'Deep B1' }
  ]
  const el = buildTocElement((k) => k, toc)
  expect(el).toBeTruthy()
  const links = el.querySelectorAll('a')
  expect(links.length).toBeGreaterThan(1)
  // hrefs should be anchors
  links.forEach(a => expect(a.getAttribute('href').startsWith('#')).toBe(true))
})

test('prepareArticle resolves relative image src and sets lazy attribute', async () => {
  document.body.innerHTML = ''
  const html = '<p><img src="image.jpg" /></p><p><img src="/static/root.png" /></p><p><img src="http://cdn.example.com/img.png" /></p>'
  const data = { isHtml: true, raw: html }
  const { article } = await prepareArticle((k) => k, data, 'posts/foo.md', null, 'http://localhost:3000/content/')
  const imgs = article.querySelectorAll('img')
  const imgRel = imgs[0]
  const imgRoot = imgs[1]
  const imgAbs = imgs[2]

  expect(imgRel.src).toContain('http://localhost:3000/content/')
  expect(imgRel.getAttribute('data-want-lazy')).toBe('1')
  expect(imgAbs.src).toBe('http://cdn.example.com/img.png')
  expect(imgRoot.getAttribute('data-want-lazy')).toBe('1')
})

test('prepareArticle rewrites relative asset urls in HTML input', async () => {
  document.body.innerHTML = ''
  const html = `
    <img src="a.png" srcset="a.png 1x, b.png 2x" />
    <link rel="stylesheet" href="styles/main.css" />
    <a href="#local">link</a>
    <svg><use xlink:href="sprite.svg#icon"></use></svg>
    <video poster="poster.jpg"></video>
  `
  const data = { isHtml: true, raw: html }
  const { article } = await prepareArticle((k) => k, data, 'posts/foo.md', null, 'http://localhost:3000/content/')

  const img = article.querySelector('img')
  const link = article.querySelector('link')
  const a = article.querySelector('a')
  const use = article.querySelector('use')
  const video = article.querySelector('video')

  expect(img.getAttribute('src').startsWith('http://localhost:3000/')).toBe(true)
  expect(img.getAttribute('srcset')).toContain('http://localhost:3000/')
  expect(link.getAttribute('href').startsWith('http://localhost:3000/')).toBe(true)
  expect(a.getAttribute('href')).toBe('#local')
  expect(use.getAttribute('xlink:href').includes('#icon')).toBe(true)
  expect(use.getAttribute('xlink:href').startsWith('http://localhost:3000/')).toBe(true)
  expect(video.getAttribute('poster').startsWith('http://localhost:3000/')).toBe(true)
})

test('createNavTree builds a menu with nested items', () => {
  const tree = [ { path: 'a', name: 'A', children: [{ path: 'a1', name: 'A1' }] } ]
  const nav = createNavTree((k) => k, tree)
  expect(nav.querySelectorAll('a').length).toBe(2)
  expect(nav.querySelector('.menu-label').textContent).toBe('navigation')
})
