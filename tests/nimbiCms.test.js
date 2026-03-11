import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'
import * as slugMgr from '../src/slugManager.js'

// minimal DOM support
function makeAppContainer() {
  const div = document.createElement('div')
  div.id = 'app'
  document.body.appendChild(div)
  return div
}

describe('initCMS option handling', () => {
  beforeEach(() => {
    // reset any existing setting so tests don't interfere
    slugMgr.setDefaultCrawlMaxQueue(slugMgr.CRAWL_MAX_QUEUE)
    document.body.innerHTML = ''
    global.fetch = vi.fn(async (url) => {
      // simple stub for _home.md and any other page
      return { ok: true, text: () => Promise.resolve('# home') }
    })
  })

  it('honors crawlMaxQueue option', async () => {
    makeAppContainer()
    await initCMS({ el: '#app', crawlMaxQueue: 7, searchIndex: false })
    expect(slugMgr.defaultCrawlMaxQueue).toBe(7)
  })
})