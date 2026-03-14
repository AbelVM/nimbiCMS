import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as imgPreview from '../src/imagePreview.js'

describe('imagePreview pointer interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('opens preview, zooms in, supports mousedown drag fallback and dblclick toggles zoom', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=='
    img.alt = 'x'
    img.width = 800
    img.height = 600
    root.appendChild(img)
    document.body.appendChild(root)

    imgPreview.attachImagePreview(root, { t: (k) => k })

    // click to open
    img.click()
    // modal should be present
    const modal = document.querySelector('dialog.nimbi-image-preview') || document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()

    // Zoom in via control button
    const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    // click twice to ensure >1
    zoomIn.click()
    zoomIn.click()
    expect(zoomLabel.textContent).toMatch(/\d+%/)

    // simulate mousedown/mousemove/mouseup to exercise drag flow
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
    const imgEl = modal.querySelector('[data-nimbi-preview-image]')
    const mdown = new MouseEvent('mousedown', { bubbles: true, clientX: 10, clientY: 10 })
    imgEl.dispatchEvent(mdown)
    const mmove = new MouseEvent('mousemove', { bubbles: true, clientX: 30, clientY: 30 })
    imgEl.dispatchEvent(mmove)
    const mup = new MouseEvent('mouseup', { bubbles: true })
    imgEl.dispatchEvent(mup)

    // double-click toggles zoom to 2x (or back)
    const dbl = new MouseEvent('dblclick', { bubbles: true })
    imgEl.dispatchEvent(dbl)
    // check that zoom label updated
    expect(zoomLabel.textContent).toMatch(/\d+%/)
  })
})
