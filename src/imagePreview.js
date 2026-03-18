/**
 * Image preview modal helper.
 *
 * This module provides a lightweight modal dialog for previewing images at
 * full size with zoom controls. It is intentionally self-contained so it can
 * be wired into `createUI()` without polluting other modules.
 *
 * Features:
 * - Zoom in/out (wheel + buttons)
 * - Fit to window / original size
 * - Drag-to-pan when the image overflows the viewport
 * - Pinch-to-zoom (touch)
 * - Double-click / double-tap to zoom
 * - Keyboard arrow panning when zoomed
 */

let _modal = null
let _img = null
let _zoom = 1
let _label = (key, def) => def
let _naturalWidth = 0
let _naturalHeight = 0
let _updateZoomLabel = () => {}
let _zoomStep = 0.25

function _createModal() {
  if (_modal && document.contains(_modal)) return _modal
  _modal = null

  const modal = document.createElement('dialog')
  modal.className = 'nimbi-image-preview modal'
  modal.setAttribute('role', 'dialog')
  modal.setAttribute('aria-modal', 'true')
  modal.setAttribute('aria-label', _label('imagePreviewTitle', 'Image preview'))
  modal.innerHTML = `
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="nimbi-image-preview__content box" role="document">
        <button class="button is-small nimbi-image-preview__close" type="button" data-nimbi-preview-close>✕</button>
        <div class="nimbi-image-preview__image-wrapper">
          <img data-nimbi-preview-image alt="" />
        </div>
        <div class="nimbi-image-preview__controls">
          <div class="nimbi-image-preview__group">
            <button class="button is-small" type="button" data-nimbi-preview-fit>⤢</button>
            <button class="button is-small" type="button" data-nimbi-preview-original>1:1</button>
            <button class="button is-small" type="button" data-nimbi-preview-reset>⟲</button>
          </div>
          <div class="nimbi-image-preview__group">
            <button class="button is-small" type="button" data-nimbi-preview-zoom-out>−</button>
            <div class="nimbi-image-preview__zoom" data-nimbi-preview-zoom-label>100%</div>
            <button class="button is-small" type="button" data-nimbi-preview-zoom-in>＋</button>
          </div>
        </div>
      </div>
    </div>
  `

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closePreview()
    }
  })

  modal.addEventListener('wheel', (event) => {
    if (!isModalOpen()) return
    event.preventDefault()
    const delta = event.deltaY < 0 ? _zoomStep : -_zoomStep
    setZoom(_zoom + delta)
    updateZoomLabel()
    showZoomHud()
  }, { passive: false })

  modal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closePreview()
      return
    }

    if (_zoom > 1) {
      const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
      if (!wrapper) return

      const panAmount = 40
      switch (event.key) {
        case 'ArrowUp':
          wrapper.scrollTop -= panAmount
          event.preventDefault()
          break
        case 'ArrowDown':
          wrapper.scrollTop += panAmount
          event.preventDefault()
          break
        case 'ArrowLeft':
          wrapper.scrollLeft -= panAmount
          event.preventDefault()
          break
        case 'ArrowRight':
          wrapper.scrollLeft += panAmount
          event.preventDefault()
          break
      }
    }
  })

  document.body.appendChild(modal)

  _modal = modal
  _img = modal.querySelector('[data-nimbi-preview-image]')

  const fitBtn = modal.querySelector('[data-nimbi-preview-fit]')
  const originalBtn = modal.querySelector('[data-nimbi-preview-original]')
  const zoomIn = modal.querySelector('[data-nimbi-preview-zoom-in]')
  const zoomOut = modal.querySelector('[data-nimbi-preview-zoom-out]')
  const resetBtn = modal.querySelector('[data-nimbi-preview-reset]')
  const closeBtn = modal.querySelector('[data-nimbi-preview-close]')
  const zoomLabel = modal.querySelector('[data-nimbi-preview-zoom-label]')
  const zoomHud = modal.querySelector('[data-nimbi-preview-zoom-hud]')

  function updateZoomLabel() {
    if (zoomLabel) zoomLabel.textContent = `${Math.round(_zoom * 100)}%`
  }

  const showZoomHud = () => {
    if (!zoomHud) return
    zoomHud.textContent = `${Math.round(_zoom * 100)}%`
    zoomHud.classList.add('visible')
    clearTimeout(zoomHud._timeout)
    zoomHud._timeout = setTimeout(() => zoomHud.classList.remove('visible'), 800)
  }

  _updateZoomLabel = updateZoomLabel

  zoomIn.addEventListener('click', () => { setZoom(_zoom + _zoomStep); updateZoomLabel(); showZoomHud() })
  zoomOut.addEventListener('click', () => { setZoom(_zoom - _zoomStep); updateZoomLabel(); showZoomHud() })
  fitBtn.addEventListener('click', () => { fitToScreen(); updateZoomLabel(); showZoomHud() })
  originalBtn.addEventListener('click', () => { setZoom(1); updateZoomLabel(); showZoomHud() })
  resetBtn.addEventListener('click', () => { fitToScreen(); updateZoomLabel(); showZoomHud() })
  closeBtn.addEventListener('click', closePreview)

  fitBtn.title = _label('imagePreviewFit', 'Fit to screen')
  originalBtn.title = _label('imagePreviewOriginal', 'Original size')
  zoomOut.title = _label('imagePreviewZoomOut', 'Zoom out')
  zoomIn.title = _label('imagePreviewZoomIn', 'Zoom in')
  closeBtn.title = _label('imagePreviewClose', 'Close')

  closeBtn.setAttribute('aria-label', _label('imagePreviewClose', 'Close'))

  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0
  let scrollStartX = 0
  let scrollStartY = 0

  /**
   * Active pointer coordinates used for drag/pinch handling.
   * Key: pointer identifier (number). Value: {x:number,y:number}.
   * @type {Map<number,{x:number,y:number}>}
   */
  const pointers = new Map()
  let initialPinchDistance = 0
  let initialPinchZoom = 1

  const getDistance = (a, b) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.hypot(dx, dy)
  }

  const endDrag = () => {
    isDragging = false
    pointers.clear()
    initialPinchDistance = 0
    if (_img) {
      _img.classList.add('is-panning')
      _img.classList.remove('is-grabbing')
    }
  }

  let lastTapTime = 0
  let lastTapX = 0
  let lastTapY = 0
  const handleTap = (event) => {
    const now = Date.now()
    const dt = now - lastTapTime
    const dx = event.clientX - lastTapX
    const dy = event.clientY - lastTapY
    lastTapTime = now
    lastTapX = event.clientX
    lastTapY = event.clientY

    if (dt < 300 && Math.hypot(dx, dy) < 30) {
      setZoom(_zoom > 1 ? 1 : 2)
      updateZoomLabel()
      event.preventDefault()
    }
  }

  const handleDoubleClick = (event) => {
    setZoom(_zoom > 1 ? 1 : 2)
    updateZoomLabel()
    event.preventDefault()
  }

  const isModalOpen = () => {
    if (!_modal) return false
    if (typeof _modal.open === 'boolean') return _modal.open
    return _modal.classList.contains('is-active')
  }

  const moveDrag = (clientX, clientY, id = 1) => {
    if (pointers.has(id)) {
      pointers.set(id, { x: clientX, y: clientY })
    }

    if (pointers.size === 2) {
      const coords = Array.from(pointers.values())
      const dist = getDistance(coords[0], coords[1])
      if (initialPinchDistance > 0) {
        const ratio = dist / initialPinchDistance
        setZoom(initialPinchZoom * ratio)
      }
      return
    }

    if (!isDragging) return

    const wrapper = _img.closest('.nimbi-image-preview__image-wrapper')
    if (!wrapper) return

    const dx = clientX - dragStartX
    const dy = clientY - dragStartY
    wrapper.scrollLeft = scrollStartX - dx
    wrapper.scrollTop = scrollStartY - dy
  }

  const startDrag = (clientX, clientY, id = 1) => {
    if (!isModalOpen()) return

    pointers.set(id, { x: clientX, y: clientY })

    if (pointers.size === 2) {
      const coords = Array.from(pointers.values())
      initialPinchDistance = getDistance(coords[0], coords[1])
      initialPinchZoom = _zoom
      return
    }

    const wrapper = _img.closest('.nimbi-image-preview__image-wrapper')
    if (!wrapper) return

    const canScroll = wrapper.scrollWidth > wrapper.clientWidth || wrapper.scrollHeight > wrapper.clientHeight
    if (!canScroll) return

    isDragging = true
    dragStartX = clientX
    dragStartY = clientY
    scrollStartX = wrapper.scrollLeft
    scrollStartY = wrapper.scrollTop
    _img.classList.add('is-panning')
    _img.classList.remove('is-grabbing')

    window.addEventListener('pointermove', windowPointerMove)
    window.addEventListener('pointerup', windowPointerUp)
    window.addEventListener('pointercancel', windowPointerUp)
  }

  const windowPointerMove = (event) => {
    if (!isDragging) return
    event.preventDefault()
    moveDrag(event.clientX, event.clientY, event.pointerId)
  }

  const windowPointerUp = () => {
    endDrag()
    window.removeEventListener('pointermove', windowPointerMove)
    window.removeEventListener('pointerup', windowPointerUp)
    window.removeEventListener('pointercancel', windowPointerUp)
  }

  _img.addEventListener('pointerdown', (event) => {
    event.preventDefault()
    startDrag(event.clientX, event.clientY, event.pointerId)
  })
  _img.addEventListener('pointermove', (event) => {
    if (isDragging || pointers.size === 2) {
      event.preventDefault()
    }
    moveDrag(event.clientX, event.clientY, event.pointerId)
  })
  _img.addEventListener('pointerup', (event) => {
    event.preventDefault()
    if (event.pointerType === 'touch') {
      handleTap(event)
    }
    endDrag()
  })

  _img.addEventListener('dblclick', handleDoubleClick)
  _img.addEventListener('pointercancel', endDrag)

  _img.addEventListener('mousedown', (event) => {
    event.preventDefault()
    startDrag(event.clientX, event.clientY, 1)
  })
  _img.addEventListener('mousemove', (event) => {
    if (isDragging) event.preventDefault()
    moveDrag(event.clientX, event.clientY, 1)
  })
  _img.addEventListener('mouseup', (event) => {
    event.preventDefault()
    endDrag()
  })

  const wrapper = modal.querySelector('.nimbi-image-preview__image-wrapper')
  if (wrapper) {
    wrapper.addEventListener('pointerdown', (event) => {
      startDrag(event.clientX, event.clientY, event.pointerId)
      if (event && event.target && event.target.tagName === 'IMG') {
        try { event.target.classList.add('is-grabbing') } catch (e) {}
      }
    })
    wrapper.addEventListener('pointermove', (event) => {
      moveDrag(event.clientX, event.clientY, event.pointerId)
    })
    wrapper.addEventListener('pointerup', endDrag)
    wrapper.addEventListener('pointercancel', endDrag)

    wrapper.addEventListener('mousedown', (event) => {
      startDrag(event.clientX, event.clientY, 1)
      if (event && event.target && event.target.tagName === 'IMG') {
        try { event.target.classList.add('is-grabbing') } catch (e) {}
      }
    })
    wrapper.addEventListener('mousemove', (event) => {
      moveDrag(event.clientX, event.clientY, 1)
    })
    wrapper.addEventListener('mouseup', endDrag)
  }

  return modal
}

/**
 * Set the current zoom factor for the preview image.
 *
 * @param {number} value Zoom factor (0.1-4). The zoom is clamped.
 */
function setZoom(value) {
  if (!_img) return
  const num = Number(value)
  const clamped = Number.isFinite(num) ? Math.max(0.1, Math.min(4, num)) : 1
  _zoom = clamped

  const rect = _img.getBoundingClientRect()
  const naturalWidth = _naturalWidth || _img.naturalWidth || _img.width || rect.width || 0
  const naturalHeight = _naturalHeight || _img.naturalHeight || _img.height || rect.height || 0

  if (naturalWidth && naturalHeight) {
    _img.style.setProperty('--nimbi-preview-img-max-width', 'none')
    _img.style.setProperty('--nimbi-preview-img-max-height', 'none')

    _img.style.setProperty('--nimbi-preview-img-width', `${naturalWidth * _zoom}px`)
    _img.style.setProperty('--nimbi-preview-img-height', `${naturalHeight * _zoom}px`)
    _img.style.setProperty('--nimbi-preview-img-transform', 'none')
    try {
      _img.style.width = `${naturalWidth * _zoom}px`
      _img.style.height = `${naturalHeight * _zoom}px`
      _img.style.transform = 'none'
    } catch (e) {}
  } else {
    _img.style.setProperty('--nimbi-preview-img-max-width', '')
    _img.style.setProperty('--nimbi-preview-img-max-height', '')
    _img.style.setProperty('--nimbi-preview-img-width', '')
    _img.style.setProperty('--nimbi-preview-img-height', '')
    _img.style.setProperty('--nimbi-preview-img-transform', `scale(${_zoom})`)
    try { _img.style.transform = `scale(${_zoom})` } catch (e) {}
  }

  if (_img) {
    _img.classList.add('is-panning')
    _img.classList.remove('is-grabbing')
  }
}

/**
 * Set the zoom level so the image fits within the visible preview area.
 *
 * This is used for the "fit to screen" button and when the preview is first opened.
 */
function fitToScreen() {
  if (!_img) return
  const wrapper = _img.closest('.nimbi-image-preview__image-wrapper')
  if (!wrapper) return

  const rect = wrapper.getBoundingClientRect()
  if (rect.width === 0 || rect.height === 0) return

  const naturalWidth = _naturalWidth || _img.naturalWidth || rect.width
  const naturalHeight = _naturalHeight || _img.naturalHeight || rect.height
  if (!naturalWidth || !naturalHeight) return

  const scaleX = rect.width / naturalWidth
  const scaleY = rect.height / naturalHeight
  const scale = Math.min(scaleX, scaleY, 1)
  setZoom(Number.isFinite(scale) ? scale : 1)
}

/**
 * Open the preview modal and display the provided image.
 *
 * @param {string} src Image URL
 * @param {string} [alt] Alt text for the previewed image
 * @param {number} [naturalWidth] Optional natural width of the image (for when known in advance)
 * @param {number} [naturalHeight] Optional natural height of the image
 */
function openPreview(src, alt = '', naturalWidth = 0, naturalHeight = 0) {
  const modal = _createModal()
  _zoom = 1
  _naturalWidth = naturalWidth || 0
  _naturalHeight = naturalHeight || 0
  _img.src = src
  try {
    if (!alt) {
      try {
        const u = new URL(src, typeof location !== 'undefined' ? location.href : '')
        const p = u.pathname || ''
        const fn = p.substring(p.lastIndexOf('/') + 1) || src
        const label = fn.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ')
        alt = _label('imagePreviewDefaultAlt', label || 'Image')
      } catch (e) {
        alt = _label('imagePreviewDefaultAlt', 'Image')
      }
    }
  } catch (e) {}
  _img.alt = alt
  _img.style.transform = 'scale(1)'

  const captureNaturalSize = () => {
    _naturalWidth = _img.naturalWidth || _img.width || 0
    _naturalHeight = _img.naturalHeight || _img.height || 0
  }

  captureNaturalSize()

  fitToScreen()
  _updateZoomLabel()

  requestAnimationFrame(() => {
    fitToScreen()
    _updateZoomLabel()
  })

  if (!_naturalWidth || !_naturalHeight) {
    const onLoad = () => {
      captureNaturalSize()
      requestAnimationFrame(() => {
        fitToScreen()
        _updateZoomLabel()
      })
      _img.removeEventListener('load', onLoad)
    }
    _img.addEventListener('load', onLoad)
  }

  if (typeof modal.showModal === 'function') {
    if (!modal.open) modal.showModal()
  }

  modal.classList.add('is-active')

  try {
    document.documentElement.classList.add('nimbi-image-preview-open')
  } catch (e) {}

  modal.focus()
}

/**
 * Close the image preview modal, if open.
 */
function closePreview() {
  if (!_modal) return
  if (typeof _modal.close === 'function' && _modal.open) {
    _modal.close()
  }
  _modal.classList.remove('is-active')

  try {
    document.documentElement.classList.remove('nimbi-image-preview-open')
  } catch (e) {}
}

/**
 * Attach image preview behavior to all images within the given root element.
 * When an image is clicked, a modal opens and provides zoom/pan controls.
 * @param {HTMLElement} root The DOM element containing images to enhance.
 * @param {{t?: (key: string) => string}} [options] Optional helpers, such as localization.
 */
export function attachImagePreview(root, { t, zoomStep = 0.25 } = {}) {
  if (!root || !root.querySelectorAll) return

  _label = (key, def) => {
    const result = typeof t === 'function' ? t(key) : undefined
    return result || def
  }

  _zoomStep = zoomStep

  root.addEventListener('click', (event) => {
    const target = /** @type {HTMLElement} */ (event.target)
    if (!target || target.tagName !== 'IMG') return
    const img = /** @type {HTMLImageElement} */ (target)
    if (!img.src) return

    const anchor = img.closest('a')
    if (anchor && anchor.getAttribute('href')) {
      return
    }

    openPreview(img.src, img.alt || '', img.naturalWidth || 0, img.naturalHeight || 0)
  })

  let isDragging = false
  let dragStartX = 0
  let dragStartY = 0
  let scrollStartX = 0
  let scrollStartY = 0

  const pointers = new Map()
  let initialPinchDistance = 0
  let initialPinchZoom = 1

  const getDistance = (a, b) => {
    const dx = a.x - b.x
    const dy = a.y - b.y
    return Math.hypot(dx, dy)
  }

  root.addEventListener('pointerdown', (event) => {
    const target = /** @type {HTMLElement} */ (event.target)
    if (!target || target.tagName !== 'IMG') return
    const linkAncestor = target.closest('a')
    if (linkAncestor && linkAncestor.getAttribute('href')) return

    if (!_modal || !_modal.open) return

    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })

    if (pointers.size === 2) {
      const coords = Array.from(pointers.values())
      initialPinchDistance = getDistance(coords[0], coords[1])
      initialPinchZoom = _zoom
      return
    }

    const wrapper = target.closest('.nimbi-image-preview__image-wrapper')
    if (!wrapper) return

    if (_zoom <= 1) return

    event.preventDefault()
    isDragging = true
    dragStartX = event.clientX
    dragStartY = event.clientY
    scrollStartX = wrapper.scrollLeft
    scrollStartY = wrapper.scrollTop
    target.setPointerCapture(event.pointerId)
    try { target.classList.add('is-grabbing') } catch (e) {}
  })

  root.addEventListener('pointermove', (event) => {
    if (pointers.has(event.pointerId)) {
      pointers.set(event.pointerId, { x: event.clientX, y: event.clientY })
    }

    if (pointers.size === 2) {
      event.preventDefault()
      const coords = Array.from(pointers.values())
      const dist = getDistance(coords[0], coords[1])
      if (initialPinchDistance > 0) {
        const ratio = dist / initialPinchDistance
        setZoom(initialPinchZoom * ratio)
      }
      return
    }

    if (!isDragging) return
    event.preventDefault()

    const target = /** @type {HTMLElement} */ (event.target)
    const linkAncestor = target.closest && target.closest('a')
    if (linkAncestor && linkAncestor.getAttribute && linkAncestor.getAttribute('href')) return
    const wrapper = target.closest('.nimbi-image-preview__image-wrapper')
    if (!wrapper) return

    const dx = event.clientX - dragStartX
    const dy = event.clientY - dragStartY
    wrapper.scrollLeft = scrollStartX - dx
    wrapper.scrollTop = scrollStartY - dy
  })

  const endDrag = () => {
    isDragging = false
    pointers.clear()
    initialPinchDistance = 0
    try {
      const preview = document.querySelector('[data-nimbi-preview-image]')
      if (preview) {
        preview.classList.add('is-panning')
        preview.classList.remove('is-grabbing')
      }
    } catch (e) {}
  }

  root.addEventListener('pointerup', endDrag)
  root.addEventListener('pointercancel', endDrag)
}

