import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'

// Ensure a clean DOM between tests
beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
  // reset any globals that tests may rely on
  if (!(global.location && typeof global.location === 'object')) {
    global.location = new URL('http://localhost/')
  }
  // remove any leftover nimbi elements
  document.querySelectorAll('.nimbi-cms, .nimbi-overlay, .nimbi-version-label').forEach(el => el.remove())
})

describe('initCMS URL override security', () => {
  it('ignores contentPath provided via URL by default', async () => {
    // craft a location with a contentPath query param
    global.location = new URL('http://localhost/?contentPath=./evil/')
    // spy on fetch to capture requested URLs
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      return { ok: true, text: () => Promise.resolve('# Home') }
    })

    await initCMS({ el: '#app', searchIndex: false })
    // ensure none of the fetch calls went to the evil path
    const combined = calls.join('\n')
    expect(combined).not.toContain('/evil/')
    expect(combined).toContain('/content')
  })

  it('honors contentPath when host enables allowUrlPathOverrides', async () => {
    global.location = new URL('http://localhost/?contentPath=./evil/')
    const calls = []
    global.fetch = vi.fn(async (u) => {
      calls.push(String(u))
      return { ok: true, text: () => Promise.resolve('# Home') }
    })

    // opt-in via explicit option (must be passed as boolean true)
    await initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })
    const combined = calls.join('\n')
    // when honored, we expect to see the evil path in the fetch URL
    expect(combined).toContain('/evil')
  })
})
