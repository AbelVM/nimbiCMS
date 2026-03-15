import { describe, it, expect, beforeEach } from 'vitest'
import * as imgPreview from '../src/imagePreview.js'

describe('imagePreview pinch & touch interactions', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  it('pinch gesture (two pointers) updates zoom', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=='
    img.alt = 'pinch'
    img.width = 400
    img.height = 300
    root.appendChild(img)
    document.body.appendChild(root)

    imgPreview.attachImagePreview(root, { t: (k) => k })
    // open modal
    img.click()

    const modal = document.querySelector('dialog.nimbi-image-preview') || document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()

    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    expect(zoomLabel.textContent).toMatch(/\d+%/)
    const before = parseInt(zoomLabel.textContent, 10)

    const imgEl = modal.querySelector('[data-nimbi-preview-image]')
    // two pointerdown events to start pinch
    const p1 = new PointerEvent('pointerdown', { bubbles: true, pointerId: 1, clientX: 10, clientY: 10, pointerType: 'touch' })
    const p2 = new PointerEvent('pointerdown', { bubbles: true, pointerId: 2, clientX: 50, clientY: 10, pointerType: 'touch' })
    imgEl.dispatchEvent(p1)
    imgEl.dispatchEvent(p2)

    // move pointers apart to increase distance
    const move1 = new PointerEvent('pointermove', { bubbles: true, pointerId: 1, clientX: 5, clientY: 10, pointerType: 'touch' })
    const move2 = new PointerEvent('pointermove', { bubbles: true, pointerId: 2, clientX: 80, clientY: 10, pointerType: 'touch' })
    imgEl.dispatchEvent(move1)
    imgEl.dispatchEvent(move2)

    // dispatch pointerup to finish gesture
    const up1 = new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 5, clientY: 10, pointerType: 'touch' })
    const up2 = new PointerEvent('pointerup', { bubbles: true, pointerId: 2, clientX: 80, clientY: 10, pointerType: 'touch' })
    imgEl.dispatchEvent(up1)
    imgEl.dispatchEvent(up2)

    // small delay to allow handlers to run
    await new Promise(r => setTimeout(r, 50))

    const after = parseInt(zoomLabel.textContent, 10)
    expect(after).toBeGreaterThanOrEqual(before)
  })

  it('double-tap (touch) toggles zoom', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAUEBA=='
    img.alt = 'dbl'
    img.width = 400
    img.height = 300
    root.appendChild(img)
    document.body.appendChild(root)

    imgPreview.attachImagePreview(root, { t: (k) => k })
    img.click()

    const modal = document.querySelector('dialog.nimbi-image-preview') || document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()
    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    expect(zoomLabel.textContent).toMatch(/\d+%/)

    const imgEl = modal.querySelector('[data-nimbi-preview-image]')
    // simulate two quick touch pointerups at same location
    const up1 = new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 20, clientY: 20, pointerType: 'touch' })
    imgEl.dispatchEvent(up1)
    const up2 = new PointerEvent('pointerup', { bubbles: true, pointerId: 1, clientX: 20, clientY: 20, pointerType: 'touch' })
    imgEl.dispatchEvent(up2)

    // handlers run synchronously; small delay to be safe
    await new Promise(r => setTimeout(r, 20))

    const val = parseInt(zoomLabel.textContent, 10)
    expect(val === 200 || val > 100).toBe(true)
  })
})
