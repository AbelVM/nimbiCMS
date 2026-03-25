import { describe, it, expect } from 'vitest'
import { handleWorkerMessage } from '../../src/worker/renderer.js'

describe('renderer detect special names', () => {
  it('detects valid long names with hyphen and plus', async () => {
    const md = '```foo-bar+baz\n```\n'
    const res = await handleWorkerMessage({ type: 'detect', id: 'ds1', md })
    expect(res).toHaveProperty('id', 'ds1')
    expect(Array.isArray(res.result)).toBeTruthy()
    expect(res.result).toContain('foo-bar+baz')
  })
})
