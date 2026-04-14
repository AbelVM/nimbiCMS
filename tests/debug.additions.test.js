import { describe, it, expect, vi } from 'vitest'

import {
  setDebugLevel,
  getDebugLevel,
  isDebugLevel,
  isDebug,
  incrementCounter,
  getDebugCounters,
  resetDebugCounters
} from '../src/utils/debug.js'
import { debugError, debugWarn, debugInfo, debugLog } from '../src/utils/debug.js'

describe('utils/debug helpers', () => {
  it('set/get debug level and isDebug helpers work', () => {
    setDebugLevel(2)
    expect(getDebugLevel()).toBe(2)
    expect(isDebugLevel(2)).toBe(true)
    expect(isDebug()).toBe(true)
  })

  it('incrementCounter is a no-op at level 0, and works at higher levels', () => {
    resetDebugCounters()
    setDebugLevel(0)
    incrementCounter('a')
    expect(getDebugCounters()).toEqual({})

    setDebugLevel(3)
    resetDebugCounters()
    incrementCounter('x')
    expect(getDebugCounters().x).toBe(1)
    resetDebugCounters()
  })

  it('logging helpers call console when levels enabled', () => {
    // error (level 1)
    setDebugLevel(1)
    const errSpy = vi.spyOn(console, 'error')
    try {
      // use already-imported functions from module
      debugError('err')
      expect(errSpy).toHaveBeenCalled()
    } finally { errSpy.mockRestore() }

    // warn (level 2)
    setDebugLevel(2)
    const warnSpy = vi.spyOn(console, 'warn')
    try {
      debugWarn('warn')
      expect(warnSpy).toHaveBeenCalled()
    } finally { warnSpy.mockRestore() }

    // info/log (level 3)
    setDebugLevel(3)
    const infoSpy = vi.spyOn(console, 'info')
    const logSpy = vi.spyOn(console, 'log')
    try {
      debugInfo('info')
      debugLog('log')
      expect(infoSpy).toHaveBeenCalled()
      expect(logSpy).toHaveBeenCalled()
    } finally { infoSpy.mockRestore(); logSpy.mockRestore() }
  })

})
