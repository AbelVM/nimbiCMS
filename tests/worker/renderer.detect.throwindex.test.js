import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('renderer detect supported.indexOf throwing', () => {
  it('handles supported objects whose indexOf throws without crashing', async () => {
    const md = '```javascript\nconsole.log(1)\n```'
    const badSupported = { length: 1, indexOf() { throw new Error('nope') } }
    const res = await handleWorkerMessage({ type: 'detect', id: 'x', md, supported: badSupported })
    expect(res).toHaveProperty('id', 'x')
    expect(Array.isArray(res.result)).toBe(true)
  })
})
