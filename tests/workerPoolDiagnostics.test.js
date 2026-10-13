import { afterEach, describe, expect, it } from 'vitest'
import {
  getWorkerPoolDiagnostics,
  recordWorkerFallback,
  registerWorkerPool,
  unregisterWorkerPool,
} from '../src/utils/workerPoolDiagnostics.js'

describe('worker pool diagnostics', () => {
  const pool = {
    getStats: () => ({ queueLength: 3, queuePressure: 0.25, activeTasks: 2, workerCount: 4 }),
  }

  afterEach(() => unregisterWorkerPool('test', pool))

  it('reports bounded queue and worker state from PowerPool stats', () => {
    registerWorkerPool('test', pool)
    expect(getWorkerPoolDiagnostics().test).toEqual({
      queueLength: 3,
      queuePressure: 0.25,
      activeTasks: 2,
      workerCount: 4,
    })
  })

  it('reports worker fallback reasons', () => {
    recordWorkerFallback('test-fallback', 12)
    expect(getWorkerPoolDiagnostics()._fallbacks['test-fallback']).toBeGreaterThan(0)
    expect(getWorkerPoolDiagnostics()._fallbackDurationMs['test-fallback']).toBeGreaterThan(0)
  })
})
