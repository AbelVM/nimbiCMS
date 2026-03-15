import { describe, it, expect, beforeEach } from 'vitest'
import fs from 'fs/promises'
import path from 'path'

describe('generated table layout', () => {
  beforeEach(() => {
    document.head.innerHTML = ''
    document.body.innerHTML = ''
  })

  it('ensures .nimbi-article table has min-width:100% (visual check in jsdom)', async () => {
    const cssPath = path.resolve(__dirname, '../src/styles/nimbi-cms-extra.css')
    const css = await fs.readFile(cssPath, 'utf8')
    const style = document.createElement('style')
    style.textContent = css
    document.head.appendChild(style)

    const article = document.createElement('div')
    article.className = 'nimbi-article'
    // give the article a known width so percentage min-width computes to px
    article.style.width = '800px'

    const tbl = document.createElement('table')
    // add some content to the table so it has intrinsic width
    const tr = document.createElement('tr')
    const td = document.createElement('td')
    td.textContent = 'cell'
    tr.appendChild(td)
    tbl.appendChild(tr)

    article.appendChild(tbl)
    document.body.appendChild(article)

    // Allow CSS to apply
    await new Promise(r => setTimeout(r, 20))

    const cs = getComputedStyle(tbl)
    const minWidth = cs.getPropertyValue('min-width')

    // Expect computed min-width equals the article width (800px) or the literal percent
    const mw = minWidth.trim()
    expect([ '800px', '100%' ]).toContain(mw)
  })
})
