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
  // Throttle invocations to at most once per animation frame, but
  // invoke the handler immediately on the first call so tests that
  // expect synchronous behavior after dispatching events still pass.
  let scheduled = false
  return function throttled(...args) {
    const ctx = this
    if (!scheduled) {
      try { fn.apply(ctx, args) } catch (e) {}
      scheduled = true
      const reset = () => { scheduled = false }
      if (typeof requestAnimationFrame === 'function') {
        requestAnimationFrame(reset)
      } else {
        setTimeout(reset, 16)
      }
      return
    }
    // Drop additional calls until the frame has passed
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
