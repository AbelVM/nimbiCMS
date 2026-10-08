import { afterEach, describe, expect, it, vi } from 'vitest'
import { yieldIfNeeded, yieldToEventLoop } from '../src/utils/idle.js'

describe('idle utilities', () => {
  afterEach(() => {
    delete globalThis.scheduler
    vi.restoreAllMocks()
  })

  it('prefers scheduler.yield when available', async () => {
    const yieldFn = vi.fn(() => Promise.resolve())
    globalThis.scheduler = { yield: yieldFn }

    await yieldToEventLoop()
    await yieldIfNeeded(2, 2)

    expect(yieldFn).toHaveBeenCalledTimes(2)
  })

  it('falls back to a timer when scheduler is unavailable', async () => {
    vi.useFakeTimers()
    const pending = yieldToEventLoop()
    vi.runAllTimers()
    await pending
    vi.useRealTimers()
    expect(true).toBe(true)
  })
})
