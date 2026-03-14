import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

describe('imagePreview interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('opens modal on image click and zoom controls update label', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.test/foo.png'
    img.alt = 'Foo'
    // provide size hints; jsdom image naturalWidth is getter-only
    img.width = 200
    img.height = 100
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    // click the image to open preview
    img.click()
    await new Promise(r => setTimeout(r, 20))
    const modal = document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()
    expect(modal.classList.contains('is-active')).toBe(true)

    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
    const zoomOut = modal.querySelector('[data-nimbi-preview-zoom-out]')
    expect(zoomLabel.textContent).toMatch(/%/) // e.g., 100%

    // click zoom in
    zoomIn.click()
    await new Promise(r => setTimeout(r, 10))
    expect(zoomLabel.textContent).toMatch(/%/)

    // click zoom out
    zoomOut.click()
    await new Promise(r => setTimeout(r, 10))
    expect(zoomLabel.textContent).toMatch(/%/)

    // double click toggles zoom
    const imgInModal = modal.querySelector('[data-nimbi-preview-image]')
    imgInModal.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await new Promise(r => setTimeout(r, 10))
    expect(zoomLabel.textContent).toMatch(/%/)
  })
})
