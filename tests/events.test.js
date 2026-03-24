import { afterEach, describe, expect, it, vi } from 'vitest'
import { debounce, rafThrottle, scheduleDOMWrite } from '../src/utils/events.js'

describe('events utilities', () => {
  let originalRAF

  afterEach(() => {
    try { if (typeof originalRAF !== 'undefined') globalThis.requestAnimationFrame = originalRAF } catch (_) {}
    try { vi.useRealTimers() } catch (_) {}
    try { vi.restoreAllMocks() } catch (_) {}
  })

  it('debounce delays calls and uses last args', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const d = debounce(spy, 100)
    d(1)
    d(2)
    d(3)
    expect(spy).toHaveBeenCalledTimes(0)
    vi.advanceTimersByTime(100)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(3)
  })

  it('debounce with leading executes immediately and suppresses until timeout', () => {
    vi.useFakeTimers()
    const spy = vi.fn()
    const d = debounce(spy, 100, { leading: true })
    d('a')
    expect(spy).toHaveBeenCalledTimes(1)
    d('b')
    expect(spy).toHaveBeenCalledTimes(1)
    vi.advanceTimersByTime(100)
    d('c')
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy).toHaveBeenLastCalledWith('c')
  })

  it('rafThrottle calls immediately then suppresses until next frame', () => {
    originalRAF = globalThis.requestAnimationFrame
    const rafCallbacks = []
    globalThis.requestAnimationFrame = (cb) => { rafCallbacks.push(cb); return rafCallbacks.length }

    const spy = vi.fn()
    const t = rafThrottle(spy)

    t('x')
    expect(spy).toHaveBeenCalledTimes(1)
    t('y')
    expect(spy).toHaveBeenCalledTimes(1)

    // simulate RAF frame: this should reset throttle state
    rafCallbacks.shift()()

    t('z')
    expect(spy).toHaveBeenCalledTimes(2)
    expect(spy.mock.calls[0][0]).toBe('x')
    expect(spy.mock.calls[1][0]).toBe('z')
  })

  it('scheduleDOMWrite batches writes into one RAF callback', () => {
    originalRAF = globalThis.requestAnimationFrame
    const rafCallbacks = []
    globalThis.requestAnimationFrame = (cb) => { rafCallbacks.push(cb); return rafCallbacks.length }

    const calls = []
    scheduleDOMWrite(() => calls.push(1))
    scheduleDOMWrite(() => calls.push(2))
    expect(calls).toEqual([])
    expect(rafCallbacks.length).toBe(1)
    // run RAF frame
    rafCallbacks.shift()()
    expect(calls).toEqual([1,2])

    // scheduling again uses a new RAF
    scheduleDOMWrite(() => calls.push(3))
    expect(rafCallbacks.length).toBe(1)
    rafCallbacks.shift()()
    expect(calls).toEqual([1,2,3])
  })
})
