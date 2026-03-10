import { slugify, mdToSlug } from './filesManager.js'

export function createNavTree(t, tree) {
  const nav = document.createElement('aside')
  nav.className = 'menu nimbi-nav'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('navigation')
  nav.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list'
  tree.forEach((item) => {
    const li = document.createElement('li')
    const a = document.createElement('a')
    a.href = '#' + item.path
    a.textContent = item.name
    li.appendChild(a)
    if (item.children && item.children.length) {
      const subul = document.createElement('ul')
      item.children.forEach((c) => {
        const cli = document.createElement('li')
        const ca = document.createElement('a')
        ca.href = '#' + c.path
        ca.textContent = c.name
        cli.appendChild(ca)
        subul.appendChild(cli)
      })
      li.appendChild(subul)
    }
    ul.appendChild(li)
  })
  nav.appendChild(ul)
  return nav
}

export function buildTocElement(t, toc, pagePath = '') {
  const aside = document.createElement('aside')
  aside.className = 'menu nimbi-toc-inner'
  const label = document.createElement('p')
  label.className = 'menu-label'
  label.textContent = t('onThisPage')
  aside.appendChild(label)
  const ul = document.createElement('ul')
  ul.className = 'menu-list'
  toc.forEach(item => {
    if (item.level === 1) return
    const li = document.createElement('li')
    const a = document.createElement('a')
    const slug = item.id || slugify(item.text)
    try {
      const normPage = String(pagePath || '').replace(/^[\.\/]+/, '')
      const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
      if (display) a.href = `?page=${encodeURIComponent(display)}#${encodeURIComponent(slug)}`
      else a.href = `?page=${encodeURIComponent(slug)}`
    } catch (e) {
      const normPage = String(pagePath || '').replace(/^[\.\/]+/, '')
      const display = (normPage && mdToSlug && mdToSlug.has && mdToSlug.has(normPage)) ? mdToSlug.get(normPage) : normPage
      if (display) a.href = `?page=${encodeURIComponent(display)}#${encodeURIComponent(slug)}`
      else a.href = `?page=${encodeURIComponent(slug)}`
    }
    a.textContent = item.text
    li.appendChild(a)
    ul.appendChild(li)
  })
  aside.appendChild(ul)
  return aside
}
