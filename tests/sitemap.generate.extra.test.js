import { expect } from 'chai'
import * as runtimeSitemap from '../src/runtimeSitemap.js'
import * as slugManager from '../src/slugManager.js'

describe('Sitemap JSON/XML generation extra branches', () => {
  beforeEach(() => {
    slugManager.slugToMd.clear()
    slugManager.mdToSlug.clear()
  })

  it('generateSitemapJson includes allMarkdown entries and encodes slugs', async () => {
    slugManager.slugToMd.set('s1', 'page1.md')
    slugManager.slugToMd.set('s2', 'dir/page2.md')
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true })
    expect(json).to.be.an('object')
    expect(Array.isArray(json.entries)).to.equal(true)
    expect(json.entries.find(e => e.loc && e.loc.includes(encodeURIComponent('s1')))).to.exist
    expect(json.entries.find(e => e.loc && e.loc.includes(encodeURIComponent('s2')))).to.exist
  })

  it('generateSitemapXml produces xml with urlset and loc', async () => {
    slugManager.slugToMd.set('h', 'hello.md')
    const json = await runtimeSitemap.generateSitemapJson({ includeAllMarkdown: true })
    const xml = runtimeSitemap.generateSitemapXml(json)
    expect(xml).to.be.a('string')
    expect(xml.includes('<urlset')).to.equal(true)
    expect(xml.includes('<loc>')).to.equal(true)
  })
})
