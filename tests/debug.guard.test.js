import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import * as debug from '../src/utils/debug.js'

describe('debug guards', () => {
  beforeEach(() => {
    debug.resetDebugCounters()
    debug.setDebugLevel(0)
  })

  afterEach(() => {
    debug.setDebugLevel(0)
    vi.restoreAllMocks()
  })

  it('does not call expensive formatter when debug disabled', () => {
    let called = false
    const heavy = () => { called = true; return 'heavy result' }

    // debug level 0: nothing should be evaluated
    debug.setDebugLevel(0)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    debug.debugLog(heavy)
    expect(called).toBe(false)
    expect(spy).not.toHaveBeenCalled()
    spy.mockRestore()
  })

  it('calls expensive formatter when debug level is high enough', () => {
    let called = false
    const heavy = () => { called = true; return 'heavy result' }

    debug.setDebugLevel(3)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    debug.debugLog(heavy)
    expect(called).toBe(true)
    expect(spy).toHaveBeenCalled()
    spy.mockRestore()
  })

  it('supports mixed args and functions', () => {
    let called = false
    const heavy = () => { called = true; return 'X' }
    debug.setDebugLevel(3)
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
    debug.debugLog('a', heavy, 'b')
    expect(called).toBe(true)
    expect(spy).toHaveBeenCalledWith('a', 'X', 'b')
    spy.mockRestore()
  })
})
