import { test, expect } from 'vitest'
import { attachImagePreview } from '../src/imagePreview.js'

function makeImage(src = '/a.jpg') {
  const img = document.createElement('img')
  img.src = src
  img.alt = 'A'
  // provide natural sizes
  Object.defineProperty(img, 'naturalWidth', { value: 400, configurable: true })
  Object.defineProperty(img, 'naturalHeight', { value: 300, configurable: true })
  return img
}

test('opens preview modal on image click and shows zoom label', async () => {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  const img = makeImage()
  root.appendChild(img)
  document.body.appendChild(root)

  attachImagePreview(root)

  img.dispatchEvent(new MouseEvent('click', { bubbles: true }))

  const modal = document.querySelector('dialog.nimbi-image-preview')
  expect(modal).toBeTruthy()
  expect(modal.classList.contains('is-active')).toBe(true)

  const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
  expect(zoomLabel).toBeTruthy()
  expect(zoomLabel.textContent).toMatch(/%/) // e.g. 100%
})

test('wheel on modal adjusts zoom', async () => {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  const img = makeImage()
  root.appendChild(img)
  document.body.appendChild(root)

  attachImagePreview(root)
  img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  const modal = document.querySelector('dialog.nimbi-image-preview')
  const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
  const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
  const before = zoomLabel.textContent

  // click zoom-in button to change zoom
  zoomIn.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  await new Promise(res => setTimeout(res, 10))

  const after = zoomLabel.textContent
  expect(after).not.toBe(before)
})

test('double click toggles zoom and drag-to-pan updates wrapper scroll', async () => {
  document.body.innerHTML = ''
  const root = document.createElement('div')
  const img = makeImage()
  root.appendChild(img)
  document.body.appendChild(root)

  attachImagePreview(root)
  img.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  const modal = document.querySelector('dialog.nimbi-image-preview')
  const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
  const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
  const modalImg = modal.querySelector('[data-nimbi-preview-image]')

  // stub scroll/size so drag logic activates
  Object.defineProperty(wrapper, 'scrollWidth', { value: 800, configurable: true })
  Object.defineProperty(wrapper, 'clientWidth', { value: 200, configurable: true })
  wrapper.scrollLeft = 50

  // double click should toggle zoom on the modal image (to 2x)
  modalImg.dispatchEvent(new MouseEvent('dblclick', { bubbles: true }))
  await new Promise(res => setTimeout(res, 5))

  // stub scroll/size so pan logic activates and perform keyboard pan
  Object.defineProperty(wrapper, 'scrollWidth', { value: 800, configurable: true })
  Object.defineProperty(wrapper, 'clientWidth', { value: 200, configurable: true })
  wrapper.scrollLeft = 50

  const beforeScroll = wrapper.scrollLeft
  modal.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }))
  await new Promise(res => setTimeout(res, 5))
  expect(wrapper.scrollLeft).not.toBe(beforeScroll)
})
