import { expect } from 'chai'
import { parseHrefToRoute } from '../src/utils/urlHelper.js'

describe('Cosmetic URLs', () => {
  it('parses cosmetic hash-style URL into slug and anchor and params', () => {
    const href = 'http://example.com/#/my-slug#section1?foo=bar&x=1'
    const parsed = parseHrefToRoute(href)
    expect(parsed).to.be.an('object')
    expect(parsed.type).to.equal('cosmetic')
    expect(parsed.page).to.equal('my-slug')
    expect(parsed.anchor).to.equal('section1')
    // params may be parsed differently depending on implementation; check presence
    expect(parsed.params).to.match(/foo=bar/)
  })

  it('parses canonical query-style URL into page and params and anchor', () => {
    const href = 'http://example.com/?page=another-slug#anchorA&bar=baz'
    const parsed = parseHrefToRoute(href)
    expect(parsed).to.be.an('object')
    expect(parsed.type).to.equal('canonical')
    expect(parsed.page).to.equal('another-slug')
    expect(parsed.anchor).to.equal('anchorA')
    expect(parsed.params).to.match(/bar=baz/)
  })
})
