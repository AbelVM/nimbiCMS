import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

describe('imagePreview', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('opens modal and derives alt text from filename when alt missing', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/images/my_photo-01.jpg'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)

    img.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    await new Promise(r => setTimeout(r, 0))

    const modalImg = document.querySelector('[data-nimbi-preview-image]')
    expect(modalImg).toBeTruthy()
    expect(document.querySelector('.nimbi-image-preview').classList.contains('is-active')).toBe(true)
    expect(modalImg.alt).toMatch(/my photo|my_photo|my-photo/i)
    expect(document.documentElement.classList.contains('nimbi-image-preview-open')).toBe(true)
  })

  it('zoom in button updates zoom label', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'https://example.com/img.png'
    // simulate known natural size
    Object.defineProperty(img, 'naturalWidth', { value: 800, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 600, configurable: true })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))

    const zoomLabel = document.querySelector('[data-nimbi-preview-zoom-label]')
    const zoomIn = document.querySelector('[data-nimbi-preview-zoom-in]')
    expect(zoomLabel).toBeTruthy()
    const before = zoomLabel.textContent
    zoomIn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
    const after = zoomLabel.textContent
    expect(after).not.toBe(before)
    expect(Number(after.replace('%', ''))).toBeGreaterThan(Number(before.replace('%', '')))
  })

  it('double-click toggles between 100% and 200% zoom', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = '/img/a.png'
    Object.defineProperty(img, 'naturalWidth', { value: 400, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 300, configurable: true })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))

    const zoomLabel = document.querySelector('[data-nimbi-preview-zoom-label]')
    const modalImg = document.querySelector('[data-nimbi-preview-image]')
    expect(zoomLabel).toBeTruthy()

    modalImg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
    expect(Number(zoomLabel.textContent.replace('%', ''))).toBeGreaterThan(100)

    modalImg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))
    expect(Number(zoomLabel.textContent.replace('%', ''))).toBeLessThanOrEqual(100)
  })

  it('pointer drag pans wrapper when zoom > 1', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = '/img/large.png'
    Object.defineProperty(img, 'naturalWidth', { value: 1200, configurable: true })
    Object.defineProperty(img, 'naturalHeight', { value: 800, configurable: true })
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))

    const zoomIn = document.querySelector('[data-nimbi-preview-zoom-in]')
    zoomIn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await new Promise(r => setTimeout(r, 0))

    const wrapper = document.querySelector('.nimbi-image-preview__image-wrapper')
    const modal = document.querySelector('.nimbi-image-preview')
    // emulate dialog open state (jsdom lacks dialog.showModal)
    if (modal) modal.open = true
    // ensure wrapper reports overflow so dragging can start
    Object.defineProperty(wrapper, 'clientWidth', { value: 200, configurable: true })
    Object.defineProperty(wrapper, 'clientHeight', { value: 150, configurable: true })
    Object.defineProperty(wrapper, 'scrollWidth', { value: 1200, configurable: true })
    Object.defineProperty(wrapper, 'scrollHeight', { value: 800, configurable: true })

    const modalImg = document.querySelector('[data-nimbi-preview-image]')
    // initial scroll
    wrapper.scrollLeft = 0

    modalImg.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true, clientX: 100, clientY: 100, pointerId: 1 }))
    await new Promise(r => setTimeout(r, 0))
    // move left so scrollLeft increases (scrollLeft = scrollStartX - dx)
    modalImg.dispatchEvent(new PointerEvent('pointermove', { bubbles: true, clientX: 80, clientY: 100, pointerId: 1 }))
    await new Promise(r => setTimeout(r, 0))
    modalImg.dispatchEvent(new PointerEvent('pointerup', { bubbles: true, clientX: 80, clientY: 100, pointerId: 1 }))
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.scrollLeft).not.toBe(0)
  })
})
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
    expect(previewImg.classList.contains('is-panning')).toBe(true)

    modal.remove()
    root.remove()
  })
})
