import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('worker renderer edge cases', () => {
  it('returns wrapper object for unsupported message types', async () => {
    const res = await handleWorkerMessage({ type: 'unknown', payload: null })
    // handler returns an object envelope with result for unknown types
    expect(res && typeof res === 'object' && 'result' in res).toBeTruthy()
  })

  it('detect path returns array result when called', async () => {
    const res = await handleWorkerMessage({ type: 'detect', payload: '```js\nconsole.log(1)\n```' })
    expect(res && typeof res === 'object' && Array.isArray(res.result)).toBeTruthy()
  })
})
