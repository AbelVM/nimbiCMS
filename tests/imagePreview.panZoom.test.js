import { describe, it, expect, beforeEach } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

describe('imagePreview pan and zoom behaviors', () => {
  beforeEach(() => {
    // ensure container cleared
    document.body.innerHTML = ''
  })

  it('creates modal and can open preview for image', () => {
    const img = new Image()
    img.src = '/images/foo.png'
    // jsdom Image has read-only naturalWidth/naturalHeight, mock via getters
    Object.defineProperty(img, 'naturalWidth', { get: () => 200 })
    Object.defineProperty(img, 'naturalHeight', { get: () => 100 })
    document.body.appendChild(img)
    // attach handler and simulate click to open preview
    attachImagePreview(document.body)
    img.click()
    const modal = document.querySelector('dialog.nimbi-image-preview') || document.querySelector('.nimbi-image-preview')
    expect(modal).toBeTruthy()
  })
})
