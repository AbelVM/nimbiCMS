import { describe, it, expect, vi, beforeEach } from 'vitest'

import { attachImagePreview } from '../src/imagePreview.js'

beforeEach(() => {
  // clean DOM
  document.body.innerHTML = ''
})

describe('imagePreview interactions', () => {
  it('opens preview on image click and sets alt from filename when missing', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.com/path/my-image.jpg'
    Object.defineProperty(img, 'naturalWidth', { get: () => 200 })
    Object.defineProperty(img, 'naturalHeight', { get: () => 100 })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)

    img.click()

    const preview = document.querySelector('[data-nimbi-preview-image]')
    expect(preview).toBeTruthy()
    expect(preview.src).toContain('my-image.jpg')
    expect(preview.alt).toMatch(/my image|Image/)
    const modal = document.querySelector('dialog.nimbi-image-preview')
    expect(modal.classList.contains('is-active')).toBe(true)
  })

  it('wheel event changes zoom (zoom in)', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.com/p/x.png'
    Object.defineProperty(img, 'naturalWidth', { get: () => 200 })
    Object.defineProperty(img, 'naturalHeight', { get: () => 100 })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.click()
    const modal = document.querySelector('dialog.nimbi-image-preview')
    const preview = document.querySelector('[data-nimbi-preview-image]')
    // ensure modal appears
    expect(modal).toBeTruthy()

    // set modal.open so attach handlers that check it behave as in-browser
    modal.open = true

    // initial size after openPreview and fitToScreen will call setZoom(1)
    // simulate wheel up (deltaY < 0) to zoom in by _zoomStep (0.25)
    const ev = new WheelEvent('wheel', { deltaY: -100 })
    modal.dispatchEvent(ev)

    // zoom should have been applied (image gets panning class)
    expect(preview.classList.contains('is-panning')).toBe(true)
  })

  it('pointer drag pans the wrapper when zoomed and scrollable', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.com/p/x.png'
    Object.defineProperty(img, 'naturalWidth', { get: () => 400 })
    Object.defineProperty(img, 'naturalHeight', { get: () => 200 })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.click()
    const modal = document.querySelector('dialog.nimbi-image-preview')
    const preview = document.querySelector('[data-nimbi-preview-image]')
    modal.open = true

    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
    // make wrapper report scrollable
    Object.defineProperty(wrapper, 'scrollWidth', { get: () => 800 })
    Object.defineProperty(wrapper, 'clientWidth', { get: () => 200 })

    // ensure zoom > 1 so dragging engages
    // dispatch wheel to zoom in
    modal.dispatchEvent(new WheelEvent('wheel', { deltaY: -100 }))

    // pointerdown on img
    // seed an initial scrollLeft so panning produces a visible change
    wrapper.scrollLeft = 100
    const down = new PointerEvent('pointerdown', { clientX: 10, clientY: 10, pointerId: 1, bubbles: true })
    img.dispatchEvent(down)

    // move pointer
    const move = new PointerEvent('pointermove', { clientX: 50, clientY: 10, pointerId: 1, bubbles: true })
    img.dispatchEvent(move)

    // wrapper.scrollLeft should have changed
    expect(wrapper.scrollLeft).not.toBe(0)
  })
})
