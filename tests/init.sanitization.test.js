import { describe, it, expect, beforeEach, vi } from 'vitest'
import initCMS from '../src/nimbi-cms.js'

beforeEach(() => {
  document.body.innerHTML = '<div id="app"></div>'
  if (!(global.location && typeof global.location === 'object')) {
    global.location = new URL('http://localhost/')
  }
  document.querySelectorAll('.nimbi-cms, .nimbi-overlay, .nimbi-version-label').forEach(el => el.remove())
})

describe('initCMS sanitization helpers', () => {
  it('rejects unsafe contentPath containing .. when allowUrlPathOverrides is true', async () => {
    global.location = new URL('http://localhost/?contentPath=../etc/')
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
    await expect(initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })).rejects.toThrow(TypeError)
  })

  it('rejects protocol absolute contentPath when allowUrlPathOverrides is true', async () => {
    global.location = new URL('http://localhost/?contentPath=http://evil/')
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
    await expect(initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })).rejects.toThrow(TypeError)
  })

  it('accepts safe homePage basename provided via URL when allowUrlPathOverrides is true', async () => {
    global.location = new URL('http://localhost/?homePage=index.html')
    const calls = []
    global.fetch = vi.fn(async (u) => { calls.push(String(u)); return { ok: true, text: () => Promise.resolve('# Home') } })
    await initCMS({ el: '#app', searchIndex: false, allowUrlPathOverrides: true })
    const combined = calls.join('\n')
    expect(combined).toContain('index.html')
  })

  it('rejects unsafe homePage basename with slashes or .. when provided as option', async () => {
    global.fetch = vi.fn(async () => ({ ok: true, text: () => Promise.resolve('# Home') }))
    await expect(initCMS({ el: '#app', searchIndex: false, homePage: '../secret.md' })).rejects.toThrow(TypeError)
  })
})
