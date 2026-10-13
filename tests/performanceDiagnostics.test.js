import { describe, it, expect, vi, afterEach } from 'vitest'
import { startPerformanceDiagnostics } from '../src/utils/performanceDiagnostics.js'

describe('performance diagnostics', () => {
  const originalObserver = globalThis.PerformanceObserver

  afterEach(() => {
    globalThis.PerformanceObserver = originalObserver
    delete window.__nimbiPerformanceDiagnostics
  })

  it('records bounded long-task entries and disposes on abort', () => {
    const observers = []
    globalThis.PerformanceObserver = class {
      static supportedEntryTypes = ['longtask']
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {}
      disconnect = vi.fn()
    }
    const controller = new AbortController()
    startPerformanceDiagnostics(controller.signal)
    const observer = observers[0]
    for (let i = 0; i < 55; i += 1) {
      observer.callback({ getEntries: () => [{ name: 'task', startTime: i, duration: 60 }] })
    }
    expect(window.__nimbiPerformanceDiagnostics).toHaveLength(50)
    controller.abort()
    expect(observer.disconnect).toHaveBeenCalled()
    expect(window.__nimbiPerformanceDiagnostics).toBeNull()
  })

  it('is a no-op when PerformanceObserver is unavailable', () => {
    delete globalThis.PerformanceObserver
    expect(() => startPerformanceDiagnostics()).not.toThrow()
  })

  it('records feature-detected interaction timing fields', () => {
    const observers = []
    globalThis.PerformanceObserver = class {
      static supportedEntryTypes = ['event']
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe = vi.fn()
      disconnect = vi.fn()
    }
    startPerformanceDiagnostics()
    observers[0].callback({ getEntries: () => [{ name: 'click', duration: 24, interactionId: 7, processingStart: 10, processingEnd: 34 }] })
    expect(window.__nimbiPerformanceDiagnostics[0]).toMatchObject({ interactionId: 7, processingStart: 10, processingEnd: 34 })
    expect(window.__nimbiPerformanceDiagnosticsSummary).toMatchObject({ count: 1, p50: 24, interactionCount: 1 })
    expect(observers[0].observe).toHaveBeenCalledWith({ type: 'event', buffered: true, durationThreshold: 16 })
  })

  it('records feature-detected heap usage', () => {
    Object.defineProperty(globalThis.performance, 'memory', {
      configurable: true,
      value: { usedJSHeapSize: 4096 },
    })
    const observers = []
    globalThis.PerformanceObserver = class {
      static supportedEntryTypes = ['longtask']
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {}
      disconnect() {}
    }
    startPerformanceDiagnostics()
    observers[0].callback({ getEntries: () => [{ name: 'task', duration: 20 }] })
    expect(window.__nimbiPerformanceDiagnostics[0].heapUsedBytes).toBe(4096)
  })

  it('supports an opt-in zero sample rate', () => {
    const observers = []
    globalThis.PerformanceObserver = class {
      static supportedEntryTypes = ['longtask']
      constructor(callback) {
        this.callback = callback
        observers.push(this)
      }
      observe() {}
      disconnect() {}
    }
    startPerformanceDiagnostics(undefined, { sampleRate: 0 })
    observers[0].callback({ getEntries: () => [{ name: 'task', duration: 20 }] })
    expect(window.__nimbiPerformanceDiagnostics).toHaveLength(0)
  })
})
