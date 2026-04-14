/**
 * DOM / event utilities: debounce, rafThrottle, and a small RAF batcher
 * These helpers coalesce rapid events and batch DOM writes using requestAnimationFrame.
 */
export function debounce(fn, wait = 150, options = {}) {
  let timer = null
  const leading = !!options.leading
  return function debounced(...args) {
    const ctx = this
    if (timer) clearTimeout(timer)
    if (leading && !timer) {
      try { fn.apply(ctx, args) } catch (e) {}
    }
    timer = setTimeout(() => {
      timer = null
      if (!leading) {
        try { fn.apply(ctx, args) } catch (e) {}
      }
    }, wait)
  }
}

export function rafThrottle(fn) {
  let scheduled = false
  let pendingArgs = null
  let pendingCtx = null
  return function throttled(...args) {
    pendingArgs = args
    pendingCtx = this
    if (scheduled) return
    scheduled = true
    try { fn.apply(this, args) } catch (e) {}
    pendingArgs = null
    pendingCtx = null
    const tick = () => {
      scheduled = false
      if (!pendingArgs) return
      const nextArgs = pendingArgs
      const nextCtx = pendingCtx
      pendingArgs = null
      pendingCtx = null
      scheduled = true
      try { fn.apply(nextCtx, nextArgs) } catch (e) {}
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(tick)
      } else {
        setTimeout(tick, 16)
      }
    }
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(tick)
    } else {
      setTimeout(tick, 16)
    }
  }
}

export function createRafBatcher() {
  let queue = []
  let scheduled = false
  return function schedule(fn) {
    if (typeof fn !== 'function') return
    queue.push(fn)
    if (scheduled) return
    scheduled = true
    if (typeof requestAnimationFrame === 'function') {
      requestAnimationFrame(() => {
        scheduled = false
        const q = queue.slice(0)
        queue.length = 0
        for (const f of q) {
          try { f() } catch (e) {}
        }
      })
    } else {
      setTimeout(() => {
        scheduled = false
        const q = queue.slice(0)
        queue.length = 0
        for (const f of q) {
          try { f() } catch (e) {}
        }
      }, 0)
    }
  }
}

// Shared scheduler for batching DOM writes
export const scheduleDOMWrite = createRafBatcher()
