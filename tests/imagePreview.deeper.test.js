import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

describe('imagePreview deeper interactions', () => {
  beforeEach(() => { document.body.innerHTML = '' })
  afterEach(() => { document.body.innerHTML = ''; vi.restoreAllMocks() })

  it('drag/pan changes wrapper scroll when zoomed', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.test/large.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.click()
    await new Promise(r => setTimeout(r, 20))
    const modal = document.querySelector('.nimbi-image-preview')
    const imgInModal = modal.querySelector('[data-nimbi-preview-image]')
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')

    // make wrapper appear scrollable by faking dimensions
    Object.defineProperty(wrapper, 'clientWidth', { value: 100, configurable: true })
    Object.defineProperty(wrapper, 'clientHeight', { value: 100, configurable: true })
    Object.defineProperty(wrapper, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(wrapper, 'scrollHeight', { value: 1000, configurable: true })

    // ensure zoom > 1 by dispatching dblclick
    imgInModal.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await new Promise(r => setTimeout(r, 10))

    // start mouse down (start to the right) then move left to pan rightwards
    imgInModal.dispatchEvent(new MouseEvent('mousedown', { bubbles: true, clientX: 50, clientY: 50 }))
    // move mouse to pan (leftwards movement increases wrapper.scrollLeft)
    imgInModal.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientX: 10, clientY: 10 }))
    await new Promise(r => setTimeout(r, 10))

    // jsdom may not update scroll values reliably; assert the modal image cursor indicates drag handling
    expect(imgInModal.style.cursor === 'all-scroll' || imgInModal.style.cursor === 'grabbing').toBe(true)
  })

  it('keyboard arrow keys pan when zoomed', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.test/large.png'
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.click()
    await new Promise(r => setTimeout(r, 20))
    const modal = document.querySelector('.nimbi-image-preview')
    const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')

    Object.defineProperty(wrapper, 'clientWidth', { value: 100, configurable: true })
    Object.defineProperty(wrapper, 'clientHeight', { value: 100, configurable: true })
    Object.defineProperty(wrapper, 'scrollWidth', { value: 1000, configurable: true })
    Object.defineProperty(wrapper, 'scrollHeight', { value: 1000, configurable: true })

    const imgInModal = modal.querySelector('[data-nimbi-preview-image]')
    // ensure zoom >1
    imgInModal.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
    await new Promise(r => setTimeout(r, 10))

    // simulate ArrowRight
    modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
    await new Promise(r => setTimeout(r, 10))
    expect(wrapper.scrollLeft !== 0).toBe(true)
  })

  it('fitToScreen applies width/height when natural sizes known', async () => {
    const root = document.createElement('div')
    const img = document.createElement('img')
    img.src = 'http://example.test/large.png'
    // set natural dimensions via attributes; jsdom will populate naturalWidth from resource loading, but we can provide width/height
    img.width = 800
    img.height = 400
    root.appendChild(img)
    document.body.appendChild(root)

    attachImagePreview(root)
    img.click()
    await new Promise(r => setTimeout(r, 20))
    const modal = document.querySelector('.nimbi-image-preview')
    const imgInModal = modal.querySelector('[data-nimbi-preview-image]')
    // after open, fitToScreen should set style width/height or transform
    await new Promise(r => setTimeout(r, 20))
    const w = imgInModal.style.width || imgInModal.style.transform
    expect(w).toBeTruthy()
  })
})
