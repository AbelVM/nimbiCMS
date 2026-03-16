import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

const cleanModal = () => {
  document.querySelectorAll('.nimbi-image-preview').forEach(el => el.remove())
  document.documentElement.classList.remove('nimbi-image-preview-open')
}

describe('imagePreview coverage', () => {
  beforeEach(() => {
    cleanModal()
  })

  afterEach(() => {
    cleanModal()
  })

  it('opens and closes preview modal on image click + close button', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    root.appendChild(img)

    attachImagePreview(root)
    img.click()

    const modal = document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()
    expect(modal.classList.contains('is-active')).toBe(true)

    const closeBtn = modal.querySelector('[data-nimbi-preview-close]')
    expect(closeBtn).toBeTruthy()
    closeBtn.click()

    expect(modal.classList.contains('is-active')).toBe(false)
  })

  it('zoom controls update label and image styles', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })
    img.width = 200
    img.height = 100

    // Ensure getBoundingClientRect returns a size so zoom logic can calculate
    img.getBoundingClientRect = () => ({ width: 200, height: 100, top: 0, bottom: 100 })

    root.appendChild(img)
    attachImagePreview(root)
    img.click()

    // Wait for requestAnimationFrame tasks to run
    await new Promise((resolve) => setTimeout(resolve, 0))

    const modal = document.querySelector('.nimbi-image-preview')
    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
    const zoomOut = modal.querySelector('[data-nimbi-preview-zoom-out]')

    expect(zoomLabel.textContent).toContain('%')

    const before = zoomLabel.textContent
    zoomIn.click()
    expect(zoomLabel.textContent).not.toBe(before)

    const afterZoomIn = zoomLabel.textContent
    zoomOut.click()
    expect(zoomLabel.textContent).not.toBe(afterZoomIn)

    const imgEl = modal.querySelector('[data-nimbi-preview-image]')
    expect(imgEl.style.getPropertyValue('--nimbi-preview-img-transform') || imgEl.style.getPropertyValue('--nimbi-preview-img-width')).toBeTruthy()
  })

  it('double click toggles between zoom levels', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })
    img.width = 200
    img.height = 100

    img.getBoundingClientRect = () => ({ width: 200, height: 100, top: 0, bottom: 100 })
    root.appendChild(img)

    attachImagePreview(root)
    img.click()

    await new Promise((resolve) => setTimeout(resolve, 0))

    const modal = document.querySelector('.nimbi-image-preview')
    const previewImg = modal.querySelector('[data-nimbi-preview-image]')
    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')

    const before = zoomLabel.textContent
    previewImg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    expect(zoomLabel.textContent).not.toBe(before)

    const after = zoomLabel.textContent
    previewImg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    expect(zoomLabel.textContent).not.toBe(after)
  })

  it('arrow keys pan the wrapper when zoomed', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })
    img.width = 200
    img.height = 100
    img.getBoundingClientRect = () => ({ width: 200, height: 100, top: 0, bottom: 100 })
    root.appendChild(img)

    attachImagePreview(root)
    img.click()

    await new Promise((resolve) => setTimeout(resolve, 0))

    const modal = document.querySelector('.nimbi-image-preview')
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')

    Object.defineProperty(wrapper, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(wrapper, 'clientWidth', { value: 100, configurable: true })
    Object.defineProperty(wrapper, 'scrollHeight', { value: 1000, configurable: true })
    Object.defineProperty(wrapper, 'clientHeight', { value: 100, configurable: true })
    wrapper.scrollTop = 0

    // zoom in to enable panning path
    img.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))

    // Wait for the label update after zoom change
    await new Promise((resolve) => setTimeout(resolve, 0))

    const event = new KeyboardEvent('keydown', { key: 'ArrowDown' })
    expect(() => modal.dispatchEvent(event)).not.toThrow()
  })
})
