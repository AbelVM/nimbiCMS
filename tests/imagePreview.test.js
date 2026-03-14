import { describe, it, expect, beforeEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

describe('imagePreview', () => {
  beforeEach(() => {
    // remove any existing modal from prior tests
    document.querySelectorAll('.nimbi-image-preview').forEach(el => el.remove())
  })

  it('opens modal when clicking an image and closes on backdrop click', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)

    // simulate click
    img.click()

    const modal = document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()
    expect(modal.classList.contains('is-active')).toBe(true)

    // clicking backdrop (modal itself) should close
    modal.click()
    expect(modal.classList.contains('is-active')).toBe(false)

    root.remove()
  })

  it('zoom controls adjust image transform scale', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    // jsdom doesn't populate naturalWidth/naturalHeight; stub to allow zoom sizing
    Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })
    img.click()

    const modal = document.querySelector('.nimbi-image-preview')
    const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
    const zoomOut = modal.querySelector('[data-nimbi-preview-zoom-out]')
    const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
    const previewImg = modal.querySelector('img[data-nimbi-preview-image]')
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')

    // Force a known wrapper size so fitToScreen computes a deterministic zoom.
    Object.defineProperty(wrapper, 'getBoundingClientRect', {
      value: () => ({ width: 200, height: 200 }),
      configurable: true,
    })

    // Ensure the preview has known natural dimensions.
    Object.defineProperty(previewImg, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(previewImg, 'naturalHeight', { value: 100, configurable: true })

    expect(zoomLabel.textContent).toBe('100%')

    zoomIn.click()
    expect(zoomLabel.textContent).toBe('125%')
    // Either width is set (so scroll works) or a transform occurs.
    expect(previewImg.style.width || previewImg.style.transform).toMatch(/px|scale\(1\.25\)/)

    zoomOut.click()
    expect(zoomLabel.textContent).toBe('100%')
    expect(previewImg.style.width || previewImg.style.transform).toMatch(/px|scale\(1\)/)

    modal.remove()
    root.remove()
  })

  it('falls back to default labels when translation returns an empty string', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root, { t: () => '' })
    img.click()

    const modal = document.querySelector('.nimbi-image-preview')
    const closeBtn = modal.querySelector('[data-nimbi-preview-close]')

    expect(closeBtn.title).toBe('Close')
    expect(modal.getAttribute('aria-label')).toBe('Image preview')

    modal.remove()
    root.remove()
  })

  it('allows dragging to pan when zoomed', () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/foo.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    // jsdom doesn't populate naturalWidth/naturalHeight; stub to allow zoom sizing
    Object.defineProperty(img, 'naturalWidth', { value: 200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 100, configurable: true })
    img.click()

    const modal = document.querySelector('.nimbi-image-preview')
    const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
    const previewImg = modal.querySelector('img[data-nimbi-preview-image]')

    // Ensure we have scroll room and are in zoomed-in state.
    wrapper.scrollLeft = 50
    zoomIn.click()

    previewImg.dispatchEvent(new MouseEvent('mousedown', {
      bubbles: true,
      clientX: 100,
      clientY: 100
    }))

    previewImg.dispatchEvent(new MouseEvent('mousemove', {
      bubbles: true,
      clientX: 120,
      clientY: 100
    }))

    // stop dragging
    previewImg.dispatchEvent(new MouseEvent('mouseup', {
      bubbles: true,
      clientX: 120,
      clientY: 100
    }))

    // Ensure the cursor is still in a valid state (pan mode)
    expect(previewImg.style.cursor).toBe('all-scroll')

    modal.remove()
    root.remove()
  })
})
